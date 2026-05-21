export interface ServiceData {
  title: string;
  slug: string;
  icon: string;
  shortDescription: string;
  detailedDescription: string;
  symptoms: string[];
  treatments: string[];
}

export interface BlogData {
  title: string;
  slug: string;
  category: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  image?: string;
}

export interface TestimonialData {
  name: string;
  location: string;
  rating: number;
  content: string;
}

export interface FAQData {
  question: string;
  answer: string;
}

export const DEFAULT_SERVICES: ServiceData[] = [
  {
    title: 'Skin Disorders',
    slug: 'skin-disorders',
    icon: 'Sparkles',
    shortDescription: 'Natural, permanent relief for Eczema, Psoriasis, Acne, and White Patches (Vitiligo).',
    detailedDescription: 'Skin disorders are often an external reflection of internal imbalances. Our homeopathic approach targets the root cause—such as immune dysfunction, stress, or toxin build-up—rather than just suppressing external symptoms. We provide customized treatment plans that stimulate your body’s innate healing mechanism, restoring healthy skin naturally without harsh steroid creams.',
    symptoms: ['Itching and redness', 'Dry, scaly patches', 'Chronic acne breakouts', 'Depigmentation (white patches)', 'Inflammation and blistering'],
    treatments: ['Constitutional Homeopathic Therapy', 'Blood purification triggers', 'Anti-inflammatory symptom matching', 'Immune regulation guidance']
  },
  {
    title: 'Hair Fall & Alopecia',
    slug: 'hair-fall',
    icon: 'FlameKindling',
    shortDescription: 'Advanced clinical treatment for Hair Loss, Dandruff, and Alopecia Areata.',
    detailedDescription: 'Hair loss can be triggered by genetic factors, hormonal changes, nutritional deficiencies, or high stress levels. Homeopathy offers safe and effective treatments that stimulate hair follicles, control excessive shedding, and treat scalp infections like stubborn dandruff or seborrheic dermatitis. Our customized therapies work inside out to promote healthy hair regrowth.',
    symptoms: ['Excessive daily hair shedding', 'Thinning hair density', 'Patchy baldness (Alopecia Areata)', 'Itchy, flakey scalp (Dandruff)', 'Premature hair greying'],
    treatments: ['Follicular stimulation therapy', 'Hormonal balancing formulas', 'Scalp health nourishment regimens', 'Stress-reduction homeopathy remedies']
  },
  {
    title: 'Allergy & Asthma',
    slug: 'allergy-treatment',
    icon: 'Wind',
    shortDescription: 'De-sensitize your immune system to overcome chronic Allergies, Rhinitis, and Sinus.',
    detailedDescription: 'Allergy occurs when the immune system overreacts to harmless substances like dust, pollen, or certain foods. Our homeopathic treatment aims to reduce this hypersensitivity. By strengthening the immune system, we help patients overcome chronic sneezing, watery eyes, allergic asthma, and sinus inflammation, offering long-term freedom from daily antihistamines.',
    symptoms: ['Frequent sneezing and runny nose', 'Wheezing and shortness of breath', 'Watery, itchy, or swollen eyes', 'Chronic sinus blockages and headaches', 'Skin rashes and hives (Urticaria)'],
    treatments: ['Immunomodulator homeopathic prescriptions', 'Acute allergy relief tinctures', 'Desensitization mapping', 'Respiratory lung strengthening therapy']
  },
  {
    title: 'Migraine & Chronic Headache',
    slug: 'migraine',
    icon: 'Brain',
    shortDescription: 'Gentle treatments that target vascular and nervous triggers of intense migraines.',
    detailedDescription: 'Migraines are vascular headaches caused by abnormal brain activity affecting nerve signals, chemicals, and blood vessels. Suppressive painkillers only offer temporary relief and carry side-effects. Homeopathy addresses triggers like stress, gastric upset, or hormonal fluctuations, decreasing the intensity and frequency of attacks permanently.',
    symptoms: ['Throbbing headache on one side of head', 'Nausea, vomiting, and dizziness', 'Extreme sensitivity to light and sound', 'Visual disturbances or aura', 'Chronic stress-induced head tension'],
    treatments: ['Vascular congestion relief prescriptions', 'Neural regulator remedies', 'Gastric-headache link remedies', 'Relaxation constitutional care']
  },
  {
    title: 'PCOS & Women’s Health',
    slug: 'pcos',
    icon: 'Activity',
    shortDescription: 'Hormonal regulation therapies for PCOS, irregular cycles, and thyroid concerns.',
    detailedDescription: 'Hormonal imbalances like Polycystic Ovary Syndrome (PCOS), irregular periods, and thyroid issues respond beautifully to homeopathy. Instead of using artificial hormones or birth control pills, we prescribe natural remedies that stimulate the endocrine glands to function correctly. This restores menstrual regularity, controls weight gain, and treats cysts naturally.',
    symptoms: ['Irregular or missed menstrual cycles', 'Ovarian cysts on ultrasound', 'Excessive facial hair and acne', 'Unexplained weight gain', 'Mood swings and fatigue'],
    treatments: ['Endocrine regulatory therapy', 'Ovarian cyst absorption formulas', 'Constitutional metabolic regulators', 'Stress-PMS matching cures']
  },
  {
    title: 'Child Care & Immunity',
    slug: 'child-care',
    icon: 'Baby',
    shortDescription: 'Safe, sweet pills to boost immunity and treat recurrent tonsillitis, cold, and cough.',
    detailedDescription: 'Children respond exceptionally well to homeopathy. The medicines are sweet and easy to take, and completely safe without side effects. We specialize in boosting kids’ immunity, treating recurrent cold and cough, tonsillitis, bedwetting, and teething problems, while reducing dependence on antibiotics.',
    symptoms: ['Recurrent cold, cough, and fever', 'Swollen tonsils (Tonsillitis)', 'Digestive disorders or poor appetite', 'Skin rashes and allergies', 'Bedwetting or behavioral concerns'],
    treatments: ['Immune booster pediatric drops', 'Tonsillar drainage support', 'Nutritional absorption enhancers', 'Constitutional child growth remedies']
  },
  {
    title: 'Digestive Issues',
    slug: 'digestive-issues',
    icon: 'Heart',
    shortDescription: 'Effective treatment for IBS, Acidity, Chronic Constipation, and Gastritis.',
    detailedDescription: 'Modern diets and stressful lifestyles frequently cause digestive issues like Acidity, Irritable Bowel Syndrome (IBS), Constipation, and Gastritis. Our remedies improve gut motility, heal the digestive tract lining, and regulate digestive enzyme secretion, ensuring long-term recovery and optimal nutrient absorption.',
    symptoms: ['Bloating and flatulence', 'Heartburn and acid reflux', 'Alternating diarrhea and constipation (IBS)', 'Stomach pain after eating', 'Chronic indigestion'],
    treatments: ['Gut motility stabilizers', 'Anti-acidity homeopathic remedies', 'Gastric lining repair triggers', 'Digestive enzyme enhancers']
  },
  {
    title: 'Chronic Diseases',
    slug: 'chronic-diseases',
    icon: 'Shield',
    shortDescription: 'Holistic management for Rheumatoid Arthritis, Diabetes, and Hypertension.',
    detailedDescription: 'Chronic lifestyle diseases such as Joint Pain, Arthritis, Gout, and early-stage Hypertension require long-term management. Homeopathy provides an excellent complementary or standalone system to reduce inflammation, improve joint mobility, regulate blood circulation, and prevent disease progression naturally.',
    symptoms: ['Joint pain, swelling, and stiffness', 'Uric acid build-up (Gout)', 'Fatigue and chronic body aches', 'Fluctuating blood pressure', 'Slow tissue healing'],
    treatments: ['Anti-rheumatic constitutional remedies', 'Joint lubrication and cartilage support', 'Circulatory regulation drops', 'Tissue renewal remedies']
  }
];

export const DEFAULT_BLOGS: BlogData[] = [
  {
    title: 'Why Homeopathy is the Perfect Solution for Chronic Allergies',
    slug: 'homeopathy-chronic-allergies',
    category: 'Respiratory Health',
    excerpt: 'Discover how homeopathy treats allergies by strengthening the immune system rather than just suppressing symptoms temporarily.',
    author: 'Dr. Iqbal',
    publishedAt: '2026-04-15T10:30:00Z',
    content: `
      <p>Chronic allergies, allergic rhinitis, and asthma can make daily life exhausting. Most conventional treatments rely on antihistamines or steroid inhalers, which suppress the symptoms temporarily but fail to solve the underlying problem. Once the medication wears off, the symptoms return.</p>
      
      <h3>The Homeopathic Difference</h3>
      <p>Homeopathy works on the law of "similars" and constitutional healing. Instead of blocking the body's allergic response, homeopathic medicines desensitize the immune system. We look at the individual as a whole—taking into account triggers, emotional stresses, dietary habits, and genetic history.</p>
      
      <h3>Key Benefits of Allergy Homeopathy</h3>
      <ul>
        <li><strong>No Side Effects:</strong> No drowsiness, dry mouth, or dependency, which are common with antihistamines.</li>
        <li><strong>Strengthens Immunity:</strong> Builds resistance against common allergens like pollen, dust, and animal dander.</li>
        <li><strong>Long-term Relief:</strong> Reduces the frequency and intensity of attacks, leading to complete recovery over time.</li>
      </ul>
      
      <p>If you or your children suffer from recurrent sneezing, wheezing, or watery eyes, a personalized homeopathic plan at HOMMED can help you breathe freely and live naturally.</p>
    `
  },
  {
    title: 'Natural PCOS Management: Healing Hormones Safely',
    slug: 'natural-pcos-management-hormones',
    category: 'Womens Health',
    excerpt: 'PCOS affects 1 in 5 women. Learn how homeopathy stimulates natural hormone regulation without synthetic contraceptives.',
    author: 'Dr. Iqbal',
    publishedAt: '2026-05-02T11:00:00Z',
    content: `
      <p>Polycystic Ovary Syndrome (PCOS) is a common hormonal disorder among women of reproductive age. Conventional treatments often prescribe hormone replacement therapy or birth control pills to force regular bleeding. However, this only masks the problem and does not cure the underlying endocrine dysfunction.</p>
      
      <h3>Targeting the Root Cause of PCOS</h3>
      <p>In homeopathy, we treat PCOS not just as a local ovarian disorder, but as a metabolic and hormonal imbalance. Homeopathic remedies stimulate the ovaries to produce hormones naturally, assisting in regular ovulation. Over a period of few months, cysts in the ovaries start shrinking, and normal cycle rhythm is restored.</p>
      
      <h3>Symptoms we successfully treat:</h3>
      <ul>
        <li>Irregular or absent menstrual cycles.</li>
        <li>Hirsutism (excessive facial hair growth) and cystic acne.</li>
        <li>Difficulty conceiving or infertility concerns.</li>
        <li>Insulin resistance and difficulty losing weight.</li>
      </ul>
      
      <p>Homeopathic treatment is gentle, safe, and works in harmony with your body to establish endocrine balance naturally.</p>
    `
  },
  {
    title: 'The Homeopathic Approach to Managing Psoriasis & Eczema',
    slug: 'homeopathic-psoriasis-eczema',
    category: 'Skin Care',
    excerpt: 'Learn how constitutional homeopathy addresses deep-rooted immune issues to clear skin plaques and eczema safely.',
    author: 'Dr. Iqbal',
    publishedAt: '2026-05-18T09:15:00Z',
    content: `
      <p>Psoriasis and eczema are more than just skin deep. They are autoimmune and inflammatory skin conditions that are triggered by internal factors, including genetic predisposition, immune dysregulation, and psychological stress. Applying topical steroid creams may clear the skin momentarily, but it often suppresses the disease, pushing it deeper into the system.</p>
      
      <h3>Constitutional Treatment</h3>
      <p>Homeopathy provides constitutional treatment, which means the remedy is selected based on the patient's physical and mental make-up. We evaluate how the skin lesions look, when the itching is worst, what environment relieves it, and the patient's stress levels. The remedy then stimulates the immune system to correct its auto-inflammatory actions.</p>
      
      <h3>What to Expect during Treatment</h3>
      <p>Homeopathic skin treatment requires patience. Since it heals from the inside out, patients often notice improvements in their digestion, energy levels, and sleep quality before the skin lesions completely clear. Slowly, the scaling, itching, and redness fade, leaving behind healthy, naturally-healed skin.</p>
    `
  }
];

export const DEFAULT_FAQS: FAQData[] = [
  {
    question: 'Are homeopathic medicines slow to act?',
    answer: 'This is a common myth. In acute conditions like cold, fever, colic, or diarrhea, homeopathic medicines act very quickly—often within minutes. For chronic, long-standing conditions like eczema or arthritis, the treatment takes time because it aims for a permanent cure by addressing the root cause, rather than temporary suppression.'
  },
  {
    question: 'Are there any side effects of homeopathic treatments?',
    answer: 'Homeopathic medicines are prepared from natural sources (plants, minerals, etc.) and are highly diluted. They are completely non-toxic, chemical-free, and safe for infants, pregnant women, and elderly individuals, with zero side effects.'
  },
  {
    question: 'Should I stop my conventional (allopathic) medicines during homeopathy?',
    answer: 'No, you do not need to stop your regular medications immediately, especially for critical conditions like diabetes, thyroid, or hypertension. Homeopathy can be safely taken alongside conventional medicines. As your health improves, your doctor will advise you on how to safely taper off your conventional drugs.'
  },
  {
    question: 'Are there dietary restrictions during homeopathic treatment?',
    answer: 'Because homeopathic medicines are absorbed through the nerve endings on the tongue, we recommend avoiding eating, drinking, or brushing your teeth for 15-20 minutes before and after taking the medicine. It is also advised to limit strong-smelling items like raw onions, garlic, coffee, and camphor during active treatment.'
  },
  {
    question: 'How does the booking system confirm slots?',
    answer: 'Once you book an appointment on our website, our admin team reviews the request. You will receive a WhatsApp message and an email confirming your exact slot. You can also track the status in your User Dashboard.'
  }
];

export const DEFAULT_TESTIMONIALS: TestimonialData[] = [
  {
    name: 'Rohan Sharma',
    location: 'Swaroop Nagar, Kanpur',
    rating: 5,
    content: 'I had severe Eczema for 5 years and tried all types of steroid creams with no relief. Dr. Iqbal diagnosed my condition constitutionally. Within 6 months, my skin has cleared up completely. Excellent treatment!'
  },
  {
    name: 'Priya Gupta',
    location: 'Kidwai Nagar, Kanpur',
    rating: 5,
    content: 'PCOS had disrupted my life, causing weight gain and severe hair loss. Under HOMMED’s care, my cycles have become perfectly regular, and my hair fall stopped. Truly a lifesaver!'
  },
  {
    name: 'Amit Tripathi',
    location: 'Kalyanpur, Kanpur',
    rating: 5,
    content: 'My 6-year-old son had recurrent tonsillitis every month. We were fed up with giving antibiotics. Since starting Dr. Iqbal’s sweet pills, his immunity has improved drastically and he hasn’t fallen sick in 8 months.'
  },
  {
    name: 'Shalini Singh',
    location: 'Civil Lines, Kanpur',
    rating: 5,
    content: 'Migraine was my daily nightmare. I couldn’t step into the sun. The homeopathic drops from HOMMED have reduced my headache frequency by 90%. I highly recommend Dr. Iqbal.'
  }
];
