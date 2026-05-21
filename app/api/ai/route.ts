import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json({ reply: 'How can I assist you today?' }, { status: 400 });
    }

    const text = query.toLowerCase();
    let reply = "";
    let recommendConsultation = false;

    // Symptom Mapping Dictionary
    if (text.includes('skin') || text.includes('eczema') || text.includes('acne') || text.includes('psoriasis') || text.includes('rash') || text.includes('vitiligo') || text.includes('white patch')) {
      reply = "Dr. Iqbal is a leading specialist in Skin Disorders. Homeopathy treats chronic skin issues like Eczema, Psoriasis, and Acne from the inside out, correcting the underlying immune trigger rather than just suppressing symptoms with steroid creams.";
      recommendConsultation = true;
    } 
    else if (text.includes('hair') || text.includes('fall') || text.includes('bald') || text.includes('dandruff') || text.includes('alopecia') || text.includes('shedding')) {
      reply = "We offer advanced homeopathic treatments for Hair Loss, Alopecia Areata, and seborrheic dandruff. The remedies stimulate hair follicles and restore hormonal balance naturally.";
      recommendConsultation = true;
    }
    else if (text.includes('allergy') || text.includes('asthma') || text.includes('sinus') || text.includes('sneeze') || text.includes('cold') || text.includes('cough') || text.includes('wheez')) {
      reply = "For chronic allergies, allergic rhinitis, and asthma, we provide constitutional immunomodulation. This strengthens your lungs and respiratory pathways, desensitizing your system from allergens permanently.";
      recommendConsultation = true;
    }
    else if (text.includes('migraine') || text.includes('headache') || text.includes('throbbing') || text.includes('tension')) {
      reply = "Migraines and chronic vascular headaches respond exceptionally well to homeopathy. We focus on relaxing nervous triggers, correcting digestive links, and decreasing attack frequency.";
      recommendConsultation = true;
    }
    else if (text.includes('pcos') || text.includes('pcod') || text.includes('period') || text.includes('cycle') || text.includes('ovary') || text.includes('hormon') || text.includes('thyroid')) {
      reply = "Hormonal concerns like PCOS and thyroid irregularities are treated using natural endocrine stimulants. This aids regular ovulation and dissolves ovarian cysts safely, without using synthetic birth control pills.";
      recommendConsultation = true;
    }
    else if (text.includes('child') || text.includes('kid') || text.includes('baby') || text.includes('tonsil') || text.includes('bedwet')) {
      reply = "Our pediatric homeopathic care is highly safe and effective. We boost children's immunity to treat tonsillitis, chronic colds, and digestive weakness using sweet, chemical-free pills.";
      recommendConsultation = true;
    }
    else if (text.includes('digest') || text.includes('stomach') || text.includes('acidity') || text.includes('constipat') || text.includes('ibs') || text.includes('bloat') || text.includes('gastritis')) {
      reply = "We specialize in correcting gastrointestinal issues like IBS, chronic acidity, and constipation by stabilizing gut motility and repair of the digestive tract lining naturally.";
      recommendConsultation = true;
    }
    else if (text.includes('joint') || text.includes('arthritis') || text.includes('gout') || text.includes('pain') || text.includes('bp') || text.includes('hypertension') || text.includes('rheum')) {
      reply = "For chronic conditions like Rheumatoid Arthritis, Gout, and high blood pressure, our constitutional treatment manages joint inflammation, improves lubrication, and regulates cardiovascular circulation.";
      recommendConsultation = true;
    }
    else if (text.includes('timing') || text.includes('hours') || text.includes('open') || text.includes('schedule') || text.includes('when')) {
      reply = "HOMMED is open Monday through Saturday.\nClinical timings:\n• Morning: 10:00 AM - 02:00 PM\n• Evening: 05:00 PM - 08:00 PM\nClosed on Sundays.";
      recommendConsultation = false;
    }
    else if (text.includes('fee') || text.includes('cost') || text.includes('charge') || text.includes('price')) {
      reply = "Our standard consultation fee is ₹300 for in-clinic visits. Online follow-ups and custom medicine dispatches are charged based on package duration. We keep our treatments highly affordable.";
      recommendConsultation = false;
    }
    else if (text.includes('address') || text.includes('where') || text.includes('location') || text.includes('map')) {
      reply = "HOMMED is located in Kanpur, Uttar Pradesh, India. You can view our exact clinic location on Google Maps embedded at the bottom of our homepage, or request a call for detailed directions.";
      recommendConsultation = false;
    }
    else {
      // General Greeting / FAQ response fallback
      reply = "Dr. Iqbal's Homeopathy Centre (HOMMED) offers premium, natural, and side-effect-free wellness programs in Kanpur. You can ask me about symptoms you are facing, timings, or how to book an appointment!";
      recommendConsultation = false;
    }

    return NextResponse.json({ reply, recommendConsultation }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ reply: 'Server processing error.' }, { status: 500 });
  }
}
