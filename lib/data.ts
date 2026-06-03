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
    shortDescription: 'Steroid creams se thodi der ke liye chhupa lo — ya Homeopathy se hamesha ke liye khatam karo. Eczema, Psoriasis, Vitiligo — jadd se ilaaj.',
    detailedDescription: 'Skin disorders are often an external reflection of internal imbalances. Our homeopathic approach targets the root cause—such as immune dysfunction, stress, or toxin build-up—rather than just suppressing external symptoms. We provide customized treatment plans that stimulate your body’s innate healing mechanism, restoring healthy skin naturally without harsh steroid creams.',
    symptoms: ['Itching and redness', 'Dry, scaly patches', 'Chronic acne breakouts', 'Depigmentation (white patches)', 'Inflammation and blistering'],
    treatments: ['Constitutional Homeopathic Therapy', 'Blood purification triggers', 'Anti-inflammatory symptom matching', 'Immune regulation guidance']
  },
  {
    title: 'Hair Fall & Alopecia',
    slug: 'hair-fall',
    icon: 'FlameKindling',
    shortDescription: 'Kitne bhi shampoo try kar lo — jab tak root cause theek nahi hoga, bal girte rahenge. Hamara ilaaj andar se kaam karta hai.',
    detailedDescription: 'Hair loss can be triggered by genetic factors, hormonal changes, nutritional deficiencies, or high stress levels. Homeopathy offers safe and effective treatments that stimulate hair follicles, control excessive shedding, and treat scalp infections like stubborn dandruff or seborrheic dermatitis. Our customized therapies work inside out to promote healthy hair regrowth.',
    symptoms: ['Excessive daily hair shedding', 'Thinning hair density', 'Patchy baldness (Alopecia Areata)', 'Itchy, flakey scalp (Dandruff)', 'Premature hair greying'],
    treatments: ['Follicular stimulation therapy', 'Hormonal balancing formulas', 'Scalp health nourishment regimens', 'Stress-reduction homeopathy remedies']
  },
  {
    title: 'Thyroid',
    slug: 'thyroid',
    icon: 'Activity',
    shortDescription: 'Hypothyroid, Hyperthyroid ya nodules — Dr. Iqbal ka constitutional ilaaj hormones ko naturally balance karta hai. Dependency khatam.',
    detailedDescription: 'Thyroid disorders are increasingly common and can silently affect energy, weight, mood, digestion, and reproductive health. Homeopathy stimulates the thyroid gland to self-regulate its hormone production — reducing TSH imbalances naturally. Many patients see a gradual reduction in their conventional thyroid medication dosage as homeopathic treatment progresses, under medical supervision.',
    symptoms: ['Unexplained weight gain or loss', 'Chronic fatigue and weakness', 'Hair thinning and dry skin', 'Irregular heartbeat or palpitations', 'Sensitivity to cold or heat', 'Mood changes and depression'],
    treatments: ['Thyroid gland stimulation remedies', 'Hormonal self-regulation therapy', 'Constitutional metabolic balancers', 'Anti-nodule absorption formulas']
  },
  {
    title: 'Migraine & Chronic Headache',
    slug: 'migraine',
    icon: 'Brain',
    shortDescription: 'Painkiller se kal phir wahi dard. Homeopathy migraine ki wajah ko door karta hai — bar bar nahi aane deta.',
    detailedDescription: 'Migraines are vascular headaches caused by abnormal brain activity affecting nerve signals, chemicals, and blood vessels. Suppressive painkillers only offer temporary relief and carry side-effects. Homeopathy addresses triggers like stress, gastric upset, or hormonal fluctuations, decreasing the intensity and frequency of attacks permanently.',
    symptoms: ['Throbbing headache on one side of head', 'Nausea, vomiting, and dizziness', 'Extreme sensitivity to light and sound', 'Visual disturbances or aura', 'Chronic stress-induced head tension'],
    treatments: ['Vascular congestion relief prescriptions', 'Neural regulator remedies', 'Gastric-headache link remedies', 'Relaxation constitutional care']
  },
  {
    title: 'Sexual Problem',
    slug: 'sexual-problem',
    icon: 'HeartPulse',
    shortDescription: 'Yahan judgment nahi, sirf ilaaj hai. Poori confidentiality ke saath, Dr. Iqbal se seedha consult karein.',
    detailedDescription: 'Sexual health problems — including Erectile Dysfunction, Premature Ejaculation, Low Libido, and related concerns — are often rooted in hormonal imbalance, stress, or chronic illness. Homeopathy offers a completely safe, confidential, and non-invasive solution. Our constitutional remedies restore vitality, improve hormonal balance, and address underlying anxiety without side-effects or dependency.',
    symptoms: ['Erectile dysfunction or weakness', 'Premature or delayed ejaculation', 'Low libido or loss of desire', 'Performance anxiety and stress', 'Hormonal deficiencies (low testosterone)', 'Female sexual dysfunction'],
    treatments: ['Constitutional vitality boosters', 'Hormonal balance remedies', 'Anxiety and stress management drops', 'Endocrine regulation therapy']
  },
  {
    title: 'Child Care & Immunity',
    slug: 'child-care',
    icon: 'Baby',
    shortDescription: 'Tonsils, zukaam, khansi — antibiotics se kab tak? Meethi, safe Homeopathic medicines se bachche ki immunity andar se strong banao.',
    detailedDescription: 'Children respond exceptionally well to homeopathy. The medicines are sweet and easy to take, and completely safe without side effects. We specialize in boosting kids’ immunity, treating recurrent cold and cough, tonsillitis, bedwetting, and teething problems, while reducing dependence on antibiotics.',
    symptoms: ['Recurrent cold, cough, and fever', 'Swollen tonsils (Tonsillitis)', 'Digestive disorders or poor appetite', 'Skin rashes and allergies', 'Bedwetting or behavioral concerns'],
    treatments: ['Immune booster pediatric drops', 'Tonsillar drainage support', 'Nutritional absorption enhancers', 'Constitutional child growth remedies']
  },
  {
    title: 'Digestive Issues',
    slug: 'digestive-issues',
    icon: 'Heart',
    shortDescription: 'IBS, constipation, gastritis — pet ki problem ko permanently theek karo. Bina roz ki antacid ke.',
    detailedDescription: 'Modern diets and stressful lifestyles frequently cause digestive issues like Acidity, Irritable Bowel Syndrome (IBS), Constipation, and Gastritis. Our remedies improve gut motility, heal the digestive tract lining, and regulate digestive enzyme secretion, ensuring long-term recovery and optimal nutrient absorption.',
    symptoms: ['Bloating and flatulence', 'Heartburn and acid reflux', 'Alternating diarrhea and constipation (IBS)', 'Stomach pain after eating', 'Chronic indigestion'],
    treatments: ['Gut motility stabilizers', 'Anti-acidity homeopathic remedies', 'Gastric lining repair triggers', 'Digestive enzyme enhancers']
  },
  {
    title: 'Chronic Diseases',
    slug: 'chronic-diseases',
    icon: 'Shield',
    shortDescription: 'Chronic bimariyon ka burden kam karo. Homeopathy body ko apni natural healing power wapas deta hai.',
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
    question: 'Homeopathy mein time zyada lagta hai — kya yeh sach hai?',
    answer: 'This is a common myth. In acute conditions like cold, fever, colic, or diarrhea, homeopathic medicines act very quickly—often within minutes. For chronic, long-standing conditions like eczema or arthritis, the treatment takes time because it aims for a permanent cure by addressing the root cause, rather than temporary suppression.'
  },
  {
    question: 'Kya inki dawaiyon ka koi side effect hota hai?',
    answer: 'Homeopathic medicines are prepared from natural sources (plants, minerals, etc.) and are highly diluted. They are completely non-toxic, chemical-free, and safe for infants, pregnant women, and elderly individuals, with zero side effects.'
  },
  {
    question: 'Jo pehle se dawai chal rahi hai — kya woh band karni padegi?',
    answer: 'No, you do not need to stop your regular medications immediately, especially for critical conditions like diabetes, thyroid, or hypertension. Homeopathy can be safely taken alongside conventional medicines. As your health improves, your doctor will advise you on how to safely taper off your conventional drugs.'
  },
  {
    question: 'Kya khaana-peena band karna padega ilaaj ke dauran?',
    answer: 'Because homeopathic medicines are absorbed through the nerve endings on the tongue, we recommend avoiding eating, drinking, or brushing your teeth for 15-20 minutes before and after taking the medicine. It is also advised to limit strong-smelling items like raw onions, garlic, coffee, and camphor during active treatment.'
  },
  {
    question: 'Appointment book karne ke baad kya hoga — call aayegi ya message?',
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
