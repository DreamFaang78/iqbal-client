import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { DEFAULT_BLOGS } from '@/lib/data';

const db = supabaseAdmin || supabase;

// Helper to verify JWT token and check if user is admin
async function verifyAdminToken(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return false;

    const { data: profile } = await db
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    return profile?.role === 'admin' || user.email?.toLowerCase() === 'admin@hommed.com';
  } catch (err) {
    return false;
  }
}

function mapBlog(b: any) {
  return {
    _id: b.id,
    title: b.title,
    slug: b.slug,
    category: b.category,
    content: b.content,
    excerpt: b.excerpt,
    author: b.author,
    image: b.image,
    publishedAt: b.published_at
  };
}

// GET: Retrieve all blogs or single blog by slug
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const { data: blog, error } = await db
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error || !blog) {
        // Fallback local search
        const found = DEFAULT_BLOGS.find(b => b.slug === slug);
        if (found) return NextResponse.json(found, { status: 200 });
        return NextResponse.json({ message: 'Blog article not found' }, { status: 404 });
      }
      return NextResponse.json(mapBlog(blog), { status: 200 });
    }

    const { data: blogs, error } = await db
      .from('blogs')
      .select('*')
      .order('published_at', { ascending: false });

    if (error || !blogs || blogs.length === 0) {
      return NextResponse.json(DEFAULT_BLOGS, { status: 200 });
    }
    return NextResponse.json(blogs.map(mapBlog), { status: 200 });

  } catch (err: any) {
    // Graceful fallback to default data
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    if (slug) {
      const found = DEFAULT_BLOGS.find(b => b.slug === slug);
      if (found) return NextResponse.json(found, { status: 200 });
      return NextResponse.json({ message: 'Blog not found (DB down)' }, { status: 404 });
    }
    return NextResponse.json(DEFAULT_BLOGS, { status: 200 });
  }
}

// POST: Create a new blog post (Admin Only)
export async function POST(request: Request) {
  try {
    const isAdmin = await verifyAdminToken(request);

    if (!isAdmin) {
      return NextResponse.json({ message: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { title, category, content, excerpt, image } = body;

    if (!title || !category || !content || !excerpt) {
      return NextResponse.json({ message: 'Missing required blog fields.' }, { status: 400 });
    }

    // Auto-generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const { data: newBlog, error } = await db
      .from('blogs')
      .insert({
        title,
        slug,
        category,
        content,
        excerpt,
        image: image || '/blog-placeholder.jpg',
        author: 'Dr. Iqbal'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: 'Article published successfully!',
      blog: mapBlog(newBlog)
    }, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}

// PUT: Update an existing blog post (Admin Only)
export async function PUT(request: Request) {
  try {
    const isAdmin = await verifyAdminToken(request);

    if (!isAdmin) {
      return NextResponse.json({ message: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { id, title, category, content, excerpt, image } = body;

    if (!id) {
      return NextResponse.json({ message: 'Blog ID is required' }, { status: 400 });
    }

    const { data: updated, error } = await db
      .from('blogs')
      .update({
        ...(title && { title, slug: title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') }),
        ...(category && { category }),
        ...(content && { content }),
        ...(excerpt && { excerpt }),
        ...(image && { image })
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) {
      return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Article updated successfully.',
      blog: mapBlog(updated)
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}

// DELETE: Delete a blog post (Admin Only)
export async function DELETE(request: Request) {
  try {
    const isAdmin = await verifyAdminToken(request);

    if (!isAdmin) {
      return NextResponse.json({ message: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Blog ID is required' }, { status: 400 });
    }

    const { data, error } = await db
      .from('blogs')
      .delete()
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ message: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog post deleted successfully.' }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}
