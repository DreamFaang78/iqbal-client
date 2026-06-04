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

export interface LocationData {
  name: string;
  slug: string;
  nearestBranch: string;
  address: string;
  landmark: string;
  distanceInfo: string;
  phone: string;
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
    author: 'Dr. Iqbal Quasim',
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
    author: 'Dr. Iqbal Quasim',
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
    author: 'Dr. Iqbal Quasim',
    publishedAt: '2026-05-18T09:15:00Z',
    content: `
      <p>Psoriasis and eczema are more than just skin deep. They are autoimmune and inflammatory skin conditions that are triggered by internal factors, including genetic predisposition, immune dysregulation, and psychological stress. Applying topical steroid creams may clear the skin momentarily, but it often suppresses the disease, pushing it deeper into the system.</p>
      
      <h3>Constitutional Treatment</h3>
      <p>Homeopathy provides constitutional treatment, which means the remedy is selected based on the patient's physical and mental make-up. We evaluate how the skin lesions look, when the itching is worst, what environment relieves it, and the patient's stress levels. The remedy then stimulates the immune system to correct its auto-inflammatory actions.</p>
      
      <h3>What to Expect during Treatment</h3>
      <p>Homeopathic skin treatment requires patience. Since it heals from the inside out, patients often notice improvements in their digestion, energy levels, and sleep quality before the skin lesions completely clear. Slowly, the scaling, itching, and redness fade, leaving behind healthy, naturally-healed skin.</p>
    `
  },

  // ===== 8 NEW SEO-OPTIMISED BLOGS =====

  {
    title: 'Hypothyroidism Ka Homeopathic Ilaaj — Sepia aur Thyroidinum Se Hamesha Ka Rahat | Kanpur',
    slug: 'hypothyroidism-homeopathic-ilaaj-kanpur',
    category: 'Thyroid Health',
    excerpt: 'Kanpur ke patients ke liye — Hypothyroid mein Sepia, Thyroidinum aur Calcarea Carbonica kaise kaam karte hain? Dr. Iqbal Quasim ka clinical experience aur case report.',
    author: 'Dr. Iqbal Quasim',
    publishedAt: '2026-05-20T08:00:00Z',
    content: `
      <h2>Hypothyroidism — Sirf Dawai Nahi, Asli Ilaaj Chahiye</h2>
      <p>Kanpur aur aas paas ke areas mein ek bahut common complaint hai — <strong>thyroid badh gayi hai, dawai chal rahi hai, phir bhi takleef wahi hai.</strong> Thakaan, wajan badhna, baalon ka girna, neend zyada aana — in sab symptoms ke saath log saal saal tak Thyroxine tablets khate hain, lekin TSH normalize hone ke baad bhi unhe kuch theek nahi lagta.</p>

      <p>Maine apni 10 saal ki practice mein Kanpur mein hazaron hypothyroid patients dekhe hain. Aur maine yeh clearly observe kiya hai — <strong>sirf hormone replace karna, problem solve nahi karta.</strong> Homeopathy mein hum thyroid gland ko khud apna kaam karne ki takat dete hain.</p>

      <h3>Hypothyroidism Hota Kya Hai?</h3>
      <p>Thyroid gland (jo aapki gardan mein butterfly shape mein hoti hai) jab paryapt matra mein T3 aur T4 hormones banana band kar deti hai — to ise <strong>Hypothyroidism</strong> kehte hain. Iska asar poore body metabolism par padta hai:</p>
      <ul>
        <li>Thakaan aur weakness, bina kuch kiye bhi</li>
        <li>Wajan badh jaana chahe khana kam hi khao</li>
        <li>Baalon ka jharna aur dry, rough skin</li>
        <li>Sardee zyada lagna, hamesha thandi rehna</li>
        <li>Constipation jo kisi dawai se theek nahi hoti</li>
        <li>Depression aur mental fog (yaad nahi rehta, concentrate nahi hota)</li>
        <li>Mahilao mein irregular periods aur fertility problems</li>
      </ul>

      <h3>Dr. Iqbal Ka Case — Sepia Se Hua Miracle</h3>
      <p>Ek 34 saal ki patient, Civil Lines Kanpur se, aai thi. TSH 12.4 mIU/L tha. Pichle 2 saal se 50mcg Thyroxine par thi. Shikayat thi — thakaan itni ki office se ghar aate aate letna padta tha, baal ek mutthi se zyada roz girte the, aur periods aane pe bhayanak mood swings hote the.</p>

      <p>Maine constitutional case liya. Unki personality, unke fears, unka food preference — sab dekha. <strong>Sepia 200</strong> prescribe ki — mahine mein ek baar. Aur saath mein diet aur lifestyle guidance di.</p>

      <p><strong>3 mahine baad:</strong> TSH 6.8 ho gayi. Baal girna 60% kam. Energy level behtar.<br/>
      <strong>6 mahine baad:</strong> TSH 3.2 — normal range mein. Thyroxine dose unke allopathic doctor ne khud 25mcg kar di.<br/>
      <strong>10 mahine baad:</strong> Patient dakteri supervision mein dawai band kar payi.</p>

      <h3>Key Homeopathic Remedies for Hypothyroidism</h3>
      <ul>
        <li><strong>Sepia Officinalis:</strong> Jab patient thaki hui ho, irritable ho, aur khud ke liye kuch karna na chahti ho. Mahilao mein sabse common constitutionally.</li>
        <li><strong>Thyroidinum:</strong> Thyroid gland ka nosode — directly thyroid hormone production ko stimulate karta hai.</li>
        <li><strong>Calcarea Carbonica:</strong> Moti, thandi aur lazy feel karne wale patients ke liye — jab wajan bahut zyada badh gaya ho.</li>
        <li><strong>Lycopodium:</strong> Jab digestive symptoms (gas, bloating) thyroid ke saath aate hain.</li>
        <li><strong>Graphites:</strong> Dry skin, constipation aur moti hone ki tendency wale patients ke liye.</li>
      </ul>

      <h3>Kanpur Mein Hypothyroid Ka Ilaaj — Kahan Jaayein?</h3>
      <p>HOMMED Clinic, Civil Lines aur Jajmau — dono jagah par Dr. Iqbal Quasim se milein. Online consultation bhi available hai agar aap Kanpur se door hain. <strong>10 saal ka experience, 10,000+ patients — aur haan, TSH reports leke aiye, hum sab dekhenge.</strong></p>

      <p><em>Yeh article sirf educational purpose ke liye hai. Apni current thyroid medication doctor ki salaah ke bina band na karein.</em></p>
    `
  },

  {
    title: 'Kanpur Mein Skin Allergy Ka Permanent Ilaaj — Sulphur, Graphites Se Kaise Milti Hai Rahat',
    slug: 'skin-allergy-permanent-ilaaj-kanpur',
    category: 'Skin Care',
    excerpt: 'Kanpur ki garmi aur pollution se skin allergy, eczema aur urticaria aam ho gayi hai. Jaaniye Dr. Iqbal Quasim ka constitutional homeopathic approach jo permanently rahat deta hai.',
    author: 'Dr. Iqbal Quasim',
    publishedAt: '2026-05-22T09:00:00Z',
    content: `
      <h2>Kanpur Mein Skin Allergy — Ek Badi Problem</h2>
      <p>Kanpur ek industrial city hai. Textile mills, leather factories, vehicle pollution — yeh sab skin ko andar se affect karte hain. Aur oopar se summer mein 45°C heat. Iska result? <strong>Skin allergy, urticaria (pitti/chakte), eczema aur chronic itching</strong> — jo baar baar aati hai aur kabhi permanently nahi jaati.</p>

      <p>Zyatdar log antihistamine tablets (Cetirizine, Allegra) lete hain — thodi der rahat milti hai. Phir wahi itching, wahi red patches. <strong>Yeh suppression hai, ilaaj nahi.</strong></p>

      <h3>Skin Allergy Ke Common Types (Jo Kanpur Mein Zyada Milte Hain)</h3>
      <ul>
        <li><strong>Urticaria (Pitti/Hives):</strong> Achanak lal chakte ubhar aana, jalan aur kharish — zyada heat ya certain foods se trigger.</li>
        <li><strong>Eczema (Atopic Dermatitis):</strong> Dry, scaly, cracked skin with intense itching — usually hands, elbows, knees par.</li>
        <li><strong>Contact Dermatitis:</strong> Kisi chemical, soap, ya metal se reaction hona.</li>
        <li><strong>Psoriasis:</strong> Thick, silvery scales jo joints ke paas ya scalp par bante hain.</li>
        <li><strong>Dust/Pollen Allergy with Skin Rash:</strong> Nak ka behna, aankh ki kharish + skin reaction saath mein.</li>
      </ul>

      <h3>Homeopathy Mein Skin Allergy Ka Treatment</h3>
      <p>Homeopathy mein skin disease ko sirf skin par nahi dekha jaata. Hum yeh samajhte hain ki <strong>skin bahar ka aaina hai andar ki gadbad ka.</strong> Isliye ilaaj bhi andar se hota hai:</p>

      <ul>
        <li><strong>Sulphur:</strong> Sabse common skin remedy. Jab itching raat ko badhti ho, heat se badh jaaye, aur patient naturally garam hote hain. Chronic eczema mein excellent results.</li>
        <li><strong>Graphites:</strong> Jab skin par thick, honey-like discharge ho. Behind-ear, hands, aur skin folds mein eczema ke liye.</li>
        <li><strong>Rhus Toxicodendron:</strong> Jab blisters hon, redness ho, aur movement se thodi rahat mile.</li>
        <li><strong>Apis Mellifica:</strong> Urticaria jo bee sting jaisi feel ho — puffy, swollen, jalan ke saath.</li>
        <li><strong>Natrum Muriaticum:</strong> Jab allergy sun exposure se ho ya grief ke baad trigger ho.</li>
      </ul>

      <h3>Real Patient — Kanpur, Kakadeo</h3>
      <p>Ek 28 saal ka ladka aaya tha. 5 saal se urticaria tha. Cetirizine roz khata tha — band karte hi chakte ubhar aate. Maine Sulphur 30 se shuru kiya, phir constitutional study ke baad <strong>Natrum Muriaticum 200</strong> prescribe ki. 4 mahine mein Cetirizine band. Skin bilkul clear. Ab 18 mahine ho gaye — koi relapse nahi.</p>

      <h3>Consultation — Civil Lines & Jajmau, Kanpur</h3>
      <p>Agar aap Kanpur mein skin allergy se pareshaan hain — HOMMED clinic mein Dr. Iqbal Quasim se milein. <strong>Pehle consultation mein hi poora case history liya jaata hai — taaki bilkul sahi dawai di jaaye.</strong> Online appointments bhi available hain.</p>
    `
  },

  {
    title: 'PCOS Mein Periods Theek Karo Bina Hormonal Pills Ke — Dr. Iqbal Kanpur Ka Clinical Guide',
    slug: 'pcos-homeopathy-periods-ilaaj-kanpur',
    category: 'Womens Health',
    excerpt: 'Kanpur ki mahilaon mein PCOS aam ho gayi hai. Irregular periods, weight gain, facial hair — yeh sab hormonal pills se theek nahi hota. Jaaniye Homeopathy se kaise hota hai jadd ka ilaaj.',
    author: 'Dr. Iqbal Quasim',
    publishedAt: '2026-05-25T07:30:00Z',
    content: `
      <h2>PCOS — Kanpur Ki Mahilaon Ki Sabse Badi Tension</h2>
      <p>PCOS (Polycystic Ovary Syndrome) aaj ke time mein har 5 mein se 1 mahila ko hoti hai. Aur Kanpur mein mere clinic mein roz aisi patients aati hain jo 1-2 saal se hormonal pills kha rahi hain — periods toh aa jaate hain dawai se, lekin <strong>asli problem wahi ki wahi rehti hai.</strong></p>

      <p>Dawai band karo — periods phir band. Wajan phir badhne lagta. Face par baal phir aane lagte. Yeh cycle kabhi khatam nahi hoti agar root cause treat nahi kiya.</p>

      <h3>PCOS Kyun Hoti Hai?</h3>
      <p>PCOS sirf ovaries ka problem nahi hai — yeh ek <strong>systemic metabolic disorder</strong> hai jisme:</p>
      <ul>
        <li>Insulin resistance hoti hai (cells insulin properly use nahi kar pate)</li>
        <li>Androgens (male hormones) ka level badh jaata hai</li>
        <li>Ovulation nahi hoti ya irregular hoti hai</li>
        <li>Ovaries mein cysts ban jaate hain</li>
        <li>Stress aur poor diet isko aur badha dete hain</li>
      </ul>

      <h3>PCOS Ke Symptoms Jo Ignore Nahi Karne Chahiye</h3>
      <ul>
        <li>Periods ka irregular ya 3-6 mahine mein ek baar aana</li>
        <li>Face, chest ya back par unusual baalon ka aana</li>
        <li>Acne jo face par aur jaw ke aas paas zyada ho</li>
        <li>Wajan aur pet ka badh jaana</li>
        <li>Mood swings, anxiety, depression</li>
        <li>Pregnancy mein mushkil aana ya miscarriage</li>
      </ul>

      <h3>Homeopathy Se PCOS Ka Ilaaj — Kaise Kaam Karta Hai?</h3>
      <p>Homeopathy mein hum PCOS ko ek hormonal imbalance ki tarah treat karte hain — aur remedy is tarah select karte hain jo <strong>puri body ko rebalance kare:</strong></p>

      <ul>
        <li><strong>Pulsatilla:</strong> Jab periods late aate hain, flow bahut kam ho, aur patient emotional aur mild ho. Best for young girls with PCOS.</li>
        <li><strong>Sepia:</strong> Jab patient thaka hua feel kare, irritable ho, period cramps bahut tez hon.</li>
        <li><strong>Natrum Muriaticum:</strong> PCOS jo stress ya emotional trauma ke baad shuru hui ho.</li>
        <li><strong>Calcarea Carbonica:</strong> Moti patients jinho wajan lose karna mushkil lage aur sardee bahut lage.</li>
        <li><strong>Apis Mellifica:</strong> Jab ovarian cysts ka dard right side mein zyada ho aur swelling ho.</li>
        <li><strong>Lachesis:</strong> Left ovary mein zyada problem, jealous nature, aur periods aate hi relieve ho jaana.</li>
      </ul>

      <h3>Case — Kidwai Nagar, Kanpur</h3>
      <p>Ek 26 saal ki patient aai — 3 saal se periods nahi aa rahe the bina pills ke. Ultrasound mein bilateral PCOS. TSH, prolactin sab normal. Hormonal pills band karte hi irregularity.</p>
      <p>Constitutional study ke baad <strong>Pulsatilla 200 + Sepia 30</strong> ka course diya. 2 mahine mein period aaya bina dawai ke. 5 mahine mein regular cycle. 8 mahine mein repeat ultrasound — cysts significantly reduced. Ek saal baad — natural pregnancy.</p>

      <h3>HOMMED Clinic, Kanpur</h3>
      <p>Agar aap ya aapke ghar ki koi mahila PCOS se pareshaan hain — <strong>Dr. Iqbal Quasim se Civil Lines ya Jajmau clinic mein milein.</strong> Online consultation bhi available hai. Pehle appointment mein previous reports leke aiye — hum poora analysis karenge.</p>
    `
  },

  {
    title: 'Bacchon Ki Immunity Aur Tonsils Ka Pakka Ilaaj — Kanpur Mein Antibiotic Ki Zaroorat Nahi',
    slug: 'bachon-immunity-tonsils-ilaaj-kanpur',
    category: 'Child Health',
    excerpt: 'Kanpur mein bachon mein baar baar tonsillitis, zukam aur bukhar — antibiotics se zyada nahi chal sakta. Jaaniye Dr. Iqbal Quasim ka safe, meetha aur effective homeopathic approach.',
    author: 'Dr. Iqbal Quasim',
    publishedAt: '2026-05-28T08:30:00Z',
    content: `
      <h2>Aapke Bachche Ko Baar Baar Tonsils Kyun Ho Rahi Hai?</h2>
      <p>Bahut se parents Kanpur se mere paas aate hain aur kehte hain — <em>"Doctor sahab, bacha roz beemaar rehta hai. Zukam, khansee, tonsils — antibiotics lete hain, theek hota hai, phir 2 hafte baad wahi ho jaata hai."</em></p>

      <p>Yeh ek <strong>vicious cycle</strong> hai. Antibiotic symptoms to daba deta hai — lekin immunity ko kuch nahi deta. Har baar immunity aur kamzor hoti jaati hai. <strong>Homeopathy is cycle ko toda karta hai — andar se immunity build karta hai.</strong></p>

      <h3>Bacchon Ki Common Problems Jo Hum Treat Karte Hain</h3>
      <ul>
        <li><strong>Recurrent Tonsillitis:</strong> Baar baar tonsils ka soojna, gale mein dard, bukhar</li>
        <li><strong>Chronic Cold & Cough:</strong> Hamesha ek na ek chiz lagi rehti hai</li>
        <li><strong>Ear Infections (Otitis Media):</strong> Kaano mein dard ya discharge</li>
        <li><strong>Adenoids Ka Badhna:</strong> Naaak se sona, mouth breathing</li>
        <li><strong>Asthma & Wheezing:</strong> Raat ko saans lene mein takleef</li>
        <li><strong>Skin Rashes & Allergies:</strong> Khujli, red patches</li>
        <li><strong>Bedwetting (Enuresis):</strong> 5+ saal ki umra ke baad bhi</li>
      </ul>

      <h3>Homeopathy Bacchon Ke Liye Kyun Best Hai?</h3>
      <p>Homeopathy ki medicines <strong>meethi, chhoti aur safe</strong> hoti hain. Koi side effects nahi. Koi liver par burden nahi. Bacche khushi se lete hain. Aur sabse important — yeh <strong>immunity build karte hain</strong>, suppress nahi karte.</p>

      <h3>Key Remedies for Children</h3>
      <ul>
        <li><strong>Baryta Carbonica:</strong> Bacche jinhein baar baar tonsils hoti hai, development mein thoda slow, shy nature</li>
        <li><strong>Belladonna:</strong> Achanak tej bukhar, laal gaala, tonsils bahut lal — acute attack mein</li>
        <li><strong>Hepar Sulphuris:</strong> Tonsils par pus, gale mein kanta jaisi feeling, chhuane se dard</li>
        <li><strong>Calcarea Carbonica:</strong> Mote, thande, baar baar cold lagne wale bacche</li>
        <li><strong>Pulsatilla:</strong> Clingy, affectionate bacche — thick yellow discharge, ek taraf se dard</li>
        <li><strong>Tuberculinum:</strong> Jab recurrence bahut zyada ho aur antibiotic kaam karna band kar de</li>
        <li><strong>Echinacea + Thymuline (immune booster):</strong> Immunity build karne ke liye preventive dose</li>
      </ul>

      <h3>Real Case — Swaroop Nagar, Kanpur</h3>
      <p>8 saal ka Arjun — uski maa ne bataya ki pichle 2 saalo mein 14 baar antibiotics liye. ENT doctor ne tonsil operation suggest kiya. Maa refuse karke mere paas aai.</p>
      <p>Maine Baryta Carbonica 200 se shuruat ki, phir Tuberculinum 1M mahine mein. <strong>6 mahine mein sirf ek baar mild cold aayi — antibiotics ki zaroorat nahi padi. Tonsils normal size par aa gayi.</strong> Operation ki zaroorat nahi rahi.</p>

      <h3>Bachche Ko Leke Milein — HOMMED Kanpur</h3>
      <p>Civil Lines ya Jajmau, Kanpur mein HOMMED clinic par Dr. Iqbal Quasim bachche ka poora case dekhenge — <strong>bina kisi chemical ke, sweetmeethi medicines se — permanent ilaaj possible hai.</strong></p>
    `
  },

  {
    title: 'Migraine aur Chronic Sirdard — Kanpur Mein Hamesha Ka Ilaaj Sirf Painkiller Nahi Hai',
    slug: 'migraine-sirdard-ilaaj-kanpur',
    category: 'Neurology',
    excerpt: 'Kanpur mein migraine ek growing problem hai. Baar baar painkiller khana khatre ki nishani hai. Dr. Iqbal Quasim batate hain ki Belladonna, Natrum Mur aur Sanguinaria se kaise milti hai permanent rahat.',
    author: 'Dr. Iqbal Quasim',
    publishedAt: '2026-06-01T07:00:00Z',
    content: `
      <h2>Migraine — Ek Aisi Takleef Jo Zindagi Rok Deti Hai</h2>
      <p>Kanpur ke textile workers, IT professionals, students, aur ghar ki mahilayein — sabme ek common complaint hai: <strong>sirdard jo ruka hi nahi layta.</strong> Kuch logon mein aura hota hai (aankhon ke aage lights, blindspot), kuch mein sirf ek taraf ka tez dard, aur kuch mein nausea aur ulti.</p>

      <p>Sab Crocin ya Combiflam khaate hain — chhoti si rahat milti hai, kal phir wahi dard. <strong>Painkiller brain ko migrate se bachata nahi — sirf signal daba deta hai.</strong> Aur time ke saath medication-overuse headache (MOH) ki problem bhi shuru ho jaati hai.</p>

      <h3>Migraine Ke Types Jo Maine Kanpur Mein Dekhe Hain</h3>
      <ul>
        <li><strong>Migraine with Aura:</strong> Pehle aankhon ke aage zig-zag lines ya blindspot, phir ek taraf tez dard</li>
        <li><strong>Menstrual Migraine:</strong> Mahilao mein periods ke aas paas hone wala migraine</li>
        <li><strong>Cluster Headache:</strong> Raat ko ek hi time par ek ankhon ke paas tez jalan</li>
        <li><strong>Tension Headache:</strong> Poore sar par pressure, neck stiffness ke saath</li>
        <li><strong>Stress-Induced Migraine:</strong> Office pressure, family tension se trigger hone wala</li>
      </ul>

      <h3>Homeopathic Remedies for Migraine</h3>
      <ul>
        <li><strong>Belladonna:</strong> Achanak tez throbbing dard, sun ya light se badhe, face lal ho. Acute attack mein sabse pehle try karein.</li>
        <li><strong>Natrum Muriaticum:</strong> Sun mein jaane se migraine, aankhon ke saath shuru hone wala dard, grief ke baad trigger.</li>
        <li><strong>Sanguinaria Canadensis:</strong> Right side ka migraine — subah shuru hokar peak par aaye aur shaam ko thodi der ke liye theek ho. Retch karne par rahat.</li>
        <li><strong>Spigelia:</strong> Left side ka migraine, aankhon ke phir sar ka dard, aankhon ki movement se badhna.</li>
        <li><strong>Iris Versicolor:</strong> Migraine jo vision disturbance ke saath aaye, GI symptoms ke saath — teacher/student type patients.</li>
        <li><strong>Glonoinum:</strong> Heat ya sun se achanak sar mein blood rush, throbbing dard.</li>
      </ul>

      <h3>Case — Civil Lines, Kanpur</h3>
      <p>Ek 38 saal ki teacher aai — 12 saal se migraine. Mahine mein 8-10 attacks. Sumatriptan injection tak naubat aa gayi thi. Mood swings aur depression bhi saath mein.</p>
      <p>Detailed case liya. <strong>Natrum Muriaticum 1M</strong> prescribe ki — mahine mein ek baar. Pehle mahine mein 4 attacks. Doosre mein 2. Teesre mahine mein ek bhi nahi. <strong>5 mahine mein patient completely migraine-free.</strong> Sumatriptan band.</p>

      <h3>Agar Aap Bhi Migraine Se Pareshaan Hain — Milein HOMMED Mein</h3>
      <p>Kanpur mein Civil Lines aur Jajmau par HOMMED clinic mein Dr. Iqbal Quasim se appointment lijiye. <strong>Painkiller se nahi — asli constitutional ilaaj se — migraine hamesha ke liye band ho sakta hai.</strong></p>
    `
  },

  {
    title: 'Hair Fall aur Alopecia Ka Pakka Ilaaj — Kanpur Mein Shampoo Se Kuch Nahi Hoga',
    slug: 'hair-fall-alopecia-ilaaj-kanpur',
    category: 'Hair Care',
    excerpt: 'Kanpur ke garmi aur paani ki quality se hair fall bahut aam ho gayi hai. Dr. Iqbal Quasim batate hain ki Acidum Phosphoricum, Natrum Mur aur Silicea se baalon ka girna kaise roka jaata hai.',
    author: 'Dr. Iqbal Quasim',
    publishedAt: '2026-06-02T08:00:00Z',
    content: `
      <h2>Baal Girna — Kanpur Mein Kyun Itni Badi Problem Hai?</h2>
      <p>Kanpur ka hard water (TDS bahut zyada), textile industry ka pollution, aur summer mein intense heat — yeh sab baalon ki jad (follicles) ko andar se kamzor karte hain. Ooper se stress, nutritional deficiency, aur hormonal imbalance — result: <strong>roz subah takia par, kaanghi mein aur shower drain mein baalon ka dher.</strong></p>

      <p>Hakim, ayurvedic oil, anti-hairfall shampoo — sab try kar chuke? Kuch farak nahi pada? Kyunki <strong>baal girna symptom hai — kisi andar ki problem ka. Jab tak andar ki problem theek nahi hogi, bahar se kuch nahi hoga.</strong></p>

      <h3>Hair Fall Ke Main Causes Jo Maine Kanpur Mein Dekhe Hain</h3>
      <ul>
        <li><strong>Nutritional Deficiency:</strong> Iron, B12, Vitamin D, Zinc ki kami</li>
        <li><strong>Thyroid Dysfunction:</strong> Hypothyroid mein baal thin hote hain, sar ke top se girte hain</li>
        <li><strong>PCOS/Hormonal Imbalance:</strong> Androgen excess se hairline recede hoti hai</li>
        <li><strong>Stress (Telogen Effluvium):</strong> Koi bada trauma, operation ya emotional shock ke 2-3 mahine baad achanak bahut baal girte hain</li>
        <li><strong>Alopecia Areata:</strong> Circular patches mein baal girna — autoimmune condition</li>
        <li><strong>Scalp Infection:</strong> Dandruff, seborrhoeic dermatitis, tinea capitis</li>
      </ul>

      <h3>Homeopathic Remedies for Hair Fall</h3>
      <ul>
        <li><strong>Acidum Phosphoricum:</strong> Stress ya grief ke baad baal girna — exams ke baad, kisi death ke baad</li>
        <li><strong>Natrum Muriaticum:</strong> Grief se related hair fall — especially mahilao mein delivery ke baad ya breakup ke baad</li>
        <li><strong>Silicea:</strong> Dry, brittle, weak baal — nails bhi kamzor hon. Scalp mein sweat zyada aati ho.</li>
        <li><strong>Lycopodium:</strong> Premature greying + hair fall — digestive issues ke saath</li>
        <li><strong>Phosphorus:</strong> Baal mutthion mein girte hain — thin, fine hair, sensitive patient</li>
        <li><strong>Fluoric Acid:</strong> Alopecia Areata — patches mein baal girna</li>
        <li><strong>Calcarea Sulphurica:</strong> Dandruff + hair fall saath mein, scalp oily ho</li>
      </ul>

      <h3>Case — Kalyanpur, Kanpur</h3>
      <p>Ek 32 saal ka professional — divorce ke baad 4 mahine mein aadhe se zyada baal gir gaye. Diagnosis: Telogen Effluvium (stress-induced). Homeopathic treatment: <strong>Natrum Muriaticum 200 + Phosphorus 30.</strong> 3 mahine mein baal girna ruk gaya. 6 mahine mein naye baal aane lage. Ek saal baad — hairline almost fully restored.</p>

      <h3>Hair Fall Se Pareshan? — HOMMED Kanpur Mein Milein</h3>
      <p>Pehle hum dekhenge kya cause hai — thyroid test, iron profile sab dekhenge. Phir constitutional remedy denge. <strong>Civil Lines ya Jajmau clinic mein Dr. Iqbal Quasim se milein — online bhi available hain.</strong></p>
    `
  },

  {
    title: 'Kidney Stone (Pathri) Ka Bina Operation Homeopathic Ilaaj — Kanpur Doctor Ka Guide',
    slug: 'kidney-stone-pathri-homeopathy-kanpur',
    category: 'Urology',
    excerpt: 'Kanpur mein kidney stone (pathri) bahut common hai. Jaaniye Dr. Iqbal Quasim kaise Berberis Vulgaris aur Calcarea Renalis se stones pass karwate hain — bina operation ke.',
    author: 'Dr. Iqbal Quasim',
    publishedAt: '2026-06-03T07:00:00Z',
    content: `
      <h2>Kanpur Mein Pathri — Ek Bahut Common Problem</h2>
      <p>Kanpur ka paani bahut hard hai — calcium aur mineral content zyada hai. Yahi ek bada reason hai ki yahan kidney aur urinary stones bahut common hain. Aur jab ek baar stone ho, to urology clinic ka first suggestion hota hai — <em>"Lithotripsy karwa lo ya operation."</em></p>

      <p>Lekin kya aap jaante hain? <strong>5mm se chhote stones — aur kai baar 8mm tak ke stones bhi — Homeopathy se naturally dissolve ya pass ho sakte hain.</strong> Maine khud apni Kanpur practice mein saikdon aisi cases manage ki hain.</p>

      <h3>Kidney Stone Ke Symptoms</h3>
      <ul>
        <li>Back ya side mein achanak tez dard (renal colic) jo ruka hi nahi layta</li>
        <li>Peeshab mein jalan ya khoon aana</li>
        <li>Baar baar peeshab aana</li>
        <li>Nausea aur ulti stone colic ke dauran</li>
        <li>Bukhar agar infection bhi saath ho</li>
        <li>Ultrasound mein stone dikhai de par abhi symptoms na hon</li>
      </ul>

      <h3>Homeopathic Approach to Kidney Stones</h3>
      <p>Homeopathy mein kidney stone treatment ke do goals hote hain:</p>
      <ol>
        <li><strong>Existing stones ko dissolve ya pass karwana</strong> — bina surgery ke</li>
        <li><strong>Future stone formation rokna</strong> — constitutional treatment se</li>
      </ol>

      <h3>Key Remedies</h3>
      <ul>
        <li><strong>Berberis Vulgaris:</strong> Kidney stone ki number one homeopathic medicine. Left-sided renal colic, back se bladder tak radiating dard. Peeshab mein sediment.</li>
        <li><strong>Sarsaparilla:</strong> Right side kidney stone, peeshab karne ke end mein tez jalan, white sandy deposits.</li>
        <li><strong>Calcarea Renalis (Kidney Calculus):</strong> Nosode — specifically stones dissolve karne ke liye. Long-term prevention.</li>
        <li><strong>Lycopodium:</strong> Right kidney stones jo evening 4-8pm mein badhe. Gas aur bloating saath mein. Red sand in urine.</li>
        <li><strong>Nux Vomica:</strong> Stone ka dard jo nausea aur vomiting ke saath aaye — spasm type colic.</li>
        <li><strong>Pareira Brava:</strong> Strain karne par hi peeshab aaye, neeche thighs tak dard jaaye.</li>
      </ul>

      <h3>Case — Barra, Kanpur</h3>
      <p>Ek 45 saal ki patient — right kidney mein 7mm stone (ultrasound confirmed). Doctor ne surgery suggest ki. Patient aai HOMMED mein. <strong>Berberis Vulgaris Q + Calcarea Renalis 30</strong> ka 3 mahine ka course diya, saath mein zyada paani peene ki advice aur diet change.</p>
      <p>2 mahine baad repeat ultrasound — stone 4mm. 3 mahine baad — stone visible nahi. Aur patient ne report kiya ki ek din peeshab mein kuch sandy particles aaye the — <strong>stone naturally pass ho gayi.</strong></p>

      <h3>Kidney Stone Se Pareshaan? — HOMMED Kanpur Mein Milein</h3>
      <p><strong>Apni ultrasound report leke aiye.</strong> Dr. Iqbal Quasim stone ka size, type aur location dekhenge aur sahi treatment plan batayenge. Civil Lines aur Jajmau — dono clinics par available hain. Online consultation bhi ho sakti hai.</p>
    `
  },

  {
    title: 'Diabetes Mein Homeopathy Ka Role — Blood Sugar Control Karo Naturally | Kanpur',
    slug: 'diabetes-homeopathy-blood-sugar-kanpur',
    category: 'Diabetes Management',
    excerpt: 'Kya Homeopathy se Type 2 Diabetes control ho sakti hai? Dr. Iqbal Quasim, Kanpur — explain karte hain ki Uranium Nitricum, Syzygium Jambolanum aur Gymnema Sylvestre kaise kaam karte hain.',
    author: 'Dr. Iqbal Quasim',
    publishedAt: '2026-06-04T06:00:00Z',
    content: `
      <h2>Diabetes Aur Homeopathy — Ek Important Conversation</h2>
      <p>Pehle ek baat clear kar lete hain — <strong>agar aap already insulin ya metformin par hain, unhe khud band mat karein.</strong> Homeopathy diabetes mein ek powerful <em>complementary</em> role play karta hai — meaning aap dono saath le sakte hain. Aur time ke saath, jab blood sugar control mein aata hai, to conventional medication dose reduce ho sakti hai — doctor ki salaah se.</p>

      <p>Kanpur mein Type 2 Diabetes bahut tezi se badh raha hai — sedentary lifestyle, maida-based diet, stress — sab factors contribute karte hain. Mere paas roz aisi patients aate hain jo kehte hain — <em>"sugar toh hai, par dawai se side effects bhi hain — koi natural option hai?"</em></p>

      <h3>Homeopathy Diabetes Mein Kaise Help Karta Hai?</h3>
      <ul>
        <li><strong>Pancreatic Beta Cells Ko Stimulate Karna:</strong> Kuch remedies pancreas ki insulin production ko naturally boost karte hain</li>
        <li><strong>Insulin Resistance Kam Karna:</strong> Cells ko insulin ke response mein better banana</li>
        <li><strong>Complications Rokna:</strong> Neuropathy, retinopathy, nephropathy — inhe early stage mein rokna</li>
        <li><strong>Associated Symptoms Treat Karna:</strong> Thakaan, zyada pyaas, frequent urination, slow healing wounds</li>
        <li><strong>Stress Management:</strong> Jo blood sugar ko directly affect karta hai</li>
      </ul>

      <h3>Key Homeopathic Remedies for Diabetes</h3>
      <ul>
        <li><strong>Syzygium Jambolanum (Jamun):</strong> Blood sugar specifically lower karta hai. Pricking sensation in fingers aur toes ke liye bhi excellent.</li>
        <li><strong>Uranium Nitricum:</strong> Jab sugar high ho, emaciation ho, zyada pyaas aur bhookh lage, aur nocturia (raat ko baar baar peeshab).</li>
        <li><strong>Gymnema Sylvestre Q (Mother Tincture):</strong> Blood sugar control mein scientifically proven — pancreas ko regenerate karne ki capacity.</li>
        <li><strong>Phosphoric Acid:</strong> Diabetes jo extreme weakness aur debility ke saath ho — post-illness ya grief-related.</li>
        <li><strong>Insulin (Homeopathic):</strong> Low potency mein — pancreas stimulation ke liye.</li>
        <li><strong>Lycopodium:</strong> Jab liver dysfunction bhi diabetes ke saath ho, right-sided bloating, gas.</li>
      </ul>

      <h3>Lifestyle Advice Jo Maine Apne Kanpur Patients Ko Diya Hai</h3>
      <ul>
        <li>Subah khali pet 30 minute brisk walk — blood sugar control ka best non-pharma tool</li>
        <li>Maida, rice, aur sweet drinks band karein — ghar par gehun aata rakhein</li>
        <li>Jamun, methi ke beej, karela — yeh sab blood sugar naturally help karte hain</li>
        <li>Sleep 7-8 hours — poor sleep insulin resistance badhata hai</li>
        <li>Stress management — yoga, pranayama — cortisol blood sugar badhata hai</li>
      </ul>

      <h3>Case — Lajpat Nagar, Kanpur</h3>
      <p>Ek 52 saal ke patient — Type 2 Diabetes, HbA1c 8.9%. Metformin 1000mg BD par the. Thakaan bahut, neuropathy start ho rahi thi (paon mein jalan aur sunnapan).</p>
      <p>Homeopathic treatment: <strong>Gymnema Sylvestre Q + Uranium Nitricum 6x + Phosphoric Acid 30.</strong> Diet aur walk advice di.</p>
      <p>3 mahine baad HbA1c 7.4%. 6 mahine baad 6.8%. Neuropathy symptoms 70% better. Doctor ne khud Metformin dose reduce ki to 500mg. <strong>Patient ki energy level pehle se behtar — bilkul naya feel kar rahe hain.</strong></p>

      <h3>Diabetes Management — HOMMED Kanpur Mein</h3>
      <p>Agar aap diabetes se pareshaan hain ya complications se darne lage hain — <strong>Dr. Iqbal Quasim se milein HOMMED mein, Civil Lines ya Jajmau, Kanpur.</strong> Apni latest HbA1c, fasting/PP sugar reports leke aiye. Hum saath milke ek integrated plan banayenge — aapki dawaiyon ko replace nahi karenge, par unka burden zaroor kam karenge.</p>
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

export const DEFAULT_LOCATIONS: LocationData[] = [
  {
    name: "Civil Lines",
    slug: "civil-lines",
    nearestBranch: "Civil Lines Clinic",
    address: "Civil Lines, Kanpur, Uttar Pradesh (Near Green Park Stadium)",
    landmark: "Near Green Park Stadium",
    distanceInfo: "Located right in the heart of Civil Lines, easily accessible from all central areas.",
    phone: "9454756421"
  },
  {
    name: "Jajmau",
    slug: "jajmau",
    nearestBranch: "Jajmau Clinic",
    address: "Jajmau, Kanpur, Uttar Pradesh (Near Ganga Bridge)",
    landmark: "Near Ganga Bridge",
    distanceInfo: "Located in the main Jajmau market area, convenient for local and transit patients.",
    phone: "9454756421"
  },
  {
    name: "Kalyanpur",
    slug: "kalyanpur",
    nearestBranch: "Civil Lines Clinic",
    address: "Civil Lines, Kanpur, Uttar Pradesh (Near Green Park Stadium)",
    landmark: "Near Green Park Stadium",
    distanceInfo: "Kalyanpur is approx. 12 km from our Civil Lines Clinic. Shared autos or cabs take 20-30 mins via GT Road.",
    phone: "9454756421"
  },
  {
    name: "Swaroop Nagar",
    slug: "swaroop-nagar",
    nearestBranch: "Civil Lines Clinic",
    address: "Civil Lines, Kanpur, Uttar Pradesh (Near Green Park Stadium)",
    landmark: "Near Green Park Stadium",
    distanceInfo: "Swaroop Nagar is just 3 km from our Civil Lines Clinic, a quick 8-10 min drive via VIP Road.",
    phone: "9454756421"
  },
  {
    name: "Kidwai Nagar",
    slug: "kidwai-nagar",
    nearestBranch: "Jajmau Clinic",
    address: "Jajmau, Kanpur, Uttar Pradesh (Near Ganga Bridge)",
    landmark: "Near Ganga Bridge",
    distanceInfo: "Kidwai Nagar is approx. 8 km from our Jajmau Clinic, taking about 15-20 mins via Kidwai Nagar Bypass.",
    phone: "9454756421"
  },
  {
    name: "Barra",
    slug: "barra",
    nearestBranch: "Civil Lines Clinic",
    address: "Civil Lines, Kanpur, Uttar Pradesh (Near Green Park Stadium)",
    landmark: "Near Green Park Stadium",
    distanceInfo: "Barra is approx. 10 km from our Civil Lines Clinic. Direct cabs and autos are available via Barra Bypass road.",
    phone: "9454756421"
  },
  {
    name: "Kakadeo",
    slug: "kakadeo",
    nearestBranch: "Civil Lines Clinic",
    address: "Civil Lines, Kanpur, Uttar Pradesh (Near Green Park Stadium)",
    landmark: "Near Green Park Stadium",
    distanceInfo: "Kakadeo is approx. 6 km from our Civil Lines Clinic. It is a 12-15 min drive via Rawatpur.",
    phone: "9454756421"
  },
  {
    name: "Lajpat Nagar",
    slug: "lajpat-nagar",
    nearestBranch: "Civil Lines Clinic",
    address: "Civil Lines, Kanpur, Uttar Pradesh (Near Green Park Stadium)",
    landmark: "Near Green Park Stadium",
    distanceInfo: "Lajpat Nagar is only 4 km from our Civil Lines Clinic, taking about 10 mins via GT Road.",
    phone: "9454756421"
  },
  {
    name: "Unnao",
    slug: "unnao",
    nearestBranch: "Jajmau Clinic",
    address: "Jajmau, Kanpur, Uttar Pradesh (Near Ganga Bridge)",
    landmark: "Near Ganga Bridge",
    distanceInfo: "Unnao is located right across the Ganges bridge. Our Jajmau Clinic is approx. 15 km away, taking 25 mins via NH 27.",
    phone: "9454756421"
  },
  {
    name: "Shuklaganj",
    slug: "shuklaganj",
    nearestBranch: "Jajmau Clinic",
    address: "Jajmau, Kanpur, Uttar Pradesh (Near Ganga Bridge)",
    landmark: "Near Ganga Bridge",
    distanceInfo: "Shuklaganj is situated just across the Ganga. Our Jajmau Clinic is only 10 km away (approx. 15 mins drive).",
    phone: "9454756421"
  }
];
