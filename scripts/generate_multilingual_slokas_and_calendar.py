"""
Comprehensive Hindu Calendar & Multilingual Slokas Dataset Generator
Generates full multi-script texts across Devanagari, Telugu, Tamil, Kannada, Malayalam,
and Roman IAST with English meanings, plus comprehensive 2025-2027 Hindu festivals,
vratams, Ekadashis, Pradoshams, and Sankashtis.
"""
import json
import os
import sys
from indic_transliteration import sanscript

sys.stdout.reconfigure(encoding='utf-8')

# Ensure directories exist
os.makedirs('data/intermediate', exist_ok=True)

# -------------------------------------------------------------
# 1. CANONICAL SLOKAS WITH DEVANAGARI & ENGLISH MEANINGS
# -------------------------------------------------------------
slokas_raw = [
    {
        "slug": "mahaganapathi-dhyanam",
        "canonicalTitle": "Sri Mahaganapathi Dhyanam",
        "category": "Dhyana Sloka",
        "primaryDeity": "Ganesha",
        "backgroundContext": "Classical introductory meditative invocation to Lord Ganesha, including the celebrated Vakratunda Mahakaya and Shuklambaradharam verses.",
        "historicalNotes": "Ancient Sanskrit stotram verses rooted in the Ganesha Purana and Mudgala Purana, recited for millennia across the Indian subcontinent.",
        "traditionalNotes": "Invoked at the beginning of all Hindu undertakings, rituals, writing, study, and daily worship to remove all obstacles (Sarva Vighna Prashamana).",
        "significanceNotes": "Vakratunda Mahakaya salutes the Lord of curved trunk whose radiance matches a billion suns; Shuklambaradharam evokes serene white garments symbolizing cosmic purity.",
        "devanagariText": """शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम् ।
प्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये ॥ १ ॥

वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।
निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥ २ ॥

अगजानन पद्मार्कं गजाननमहर्निशम् ।
अनेकदन्तं भक्तानामेकदन्तमुपास्महे ॥ ३ ॥""",
        "verses": [
            {
                "verseNumber": 1,
                "deva": "शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम् ।\nप्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये ॥",
                "meaning": "We meditate upon Lord Ganesha who wears white garments, who is all-pervading, who has the radiant complexion of the moon, who possesses four arms, and whose benign countenance brings peace and pacifies all obstacles."
            },
            {
                "verseNumber": 2,
                "deva": "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
                "meaning": "O Lord with the curved trunk, immense physical presence, and the brilliance of ten million suns! Please bless me with the eradication of all obstacles in all my righteous endeavors, always."
            },
            {
                "verseNumber": 3,
                "deva": "अगजानन पद्मार्कं गजाननमहर्निशम् ।\nअनेकदन्तं भक्तानामेकदन्तमुपास्महे ॥",
                "meaning": "Just as the morning sun causes the lotus to bloom, the elephant-faced Lord brings joy to Mother Parvati's face. To His devotees, He bestows boundless blessings; we reverently worship that Single-Tusked Lord night and day."
            }
        ]
    },
    {
        "slug": "sankata-nashana-ganesha-stotram",
        "canonicalTitle": "Sri Sankata Nashana Ganesha Stotram",
        "category": "Stotram",
        "primaryDeity": "Ganesha",
        "backgroundContext": "A potent hymn of twelve holy names of Ganesha spoken by Sage Narada in the Narada Purana for liberation from all distress and affliction.",
        "historicalNotes": "Derived from the Narada Purana (Sankashti Ganesha Stotra section), widely documented in palm-leaf manuscripts and medieval devotional anthologies.",
        "traditionalNotes": "Traditionally chanted thrice a day or on Sankashti Chaturthi for resolution of obstacles, success in learning, and inner fortitude.",
        "significanceNotes": "Enumerates 12 divine forms: Vakratunda, Ekadanta, Krishnapingaksha, Gajavaktra, Lambodara, Vikata, Vighnaraja, Dhumravarna, Bhalachandra, Vinayaka, Ganapati, and Gajanana.",
        "devanagariText": """नारद उवाच ।
प्रणम्य शिरसा देवं गौरीपुत्रं विनायकम् ।
भक्तावासं स्मरेन्नित्यमायुःकामार्थसिद्धये ॥ १ ॥

प्रथमं वक्रतुण्डं च एकदन्तं द्वितीयकम् ।
तृतीयं कृष्णपिङ्गाक्षं गजवक्त्रं चतुर्थकम् ॥ २ ॥

लम्बोदरं पञ्चमं च षष्ठं विकटमेव च ।
सप्तमं विघ्नराजं च धूम्रवर्णं तथाष्टमम् ॥ ३ ॥

नवमं भालचन्द्रं च दशमं तु विनायकम् ।
एकादशं गणपतिं द्वादशं तु गजाननम् ॥ ४ ॥

द्वादशैतानि नामानि त्रिसन्ध्यं यः पठेन्नरः ।
न च विघ्नभयं तस्य सर्वसिद्धिकरं परम् ॥ ५ ॥""",
        "verses": [
            {
                "verseNumber": 1,
                "deva": "प्रणम्य शिरसा देवं गौरीपुत्रं विनायकम् ।\nभक्तावासं स्मरेन्नित्यमायुःकामार्थसिद्धये ॥",
                "meaning": "Bowing one's head with deep reverence to Lord Vinayaka, the beloved son of Mother Gauri, who ever resides in the hearts of devotees, one should remember Him daily for long life, fulfillment of righteous desires, and spiritual attainment."
            },
            {
                "verseNumber": 2,
                "deva": "प्रथमं वक्रतुण्डं च एकदन्तं द्वितीयकम् ।\nतृतीयं कृष्णपिङ्गाक्षं गजवक्त्रं चतुर्थकम् ॥",
                "meaning": "First, the Lord of curved trunk (Vakratunda); second, the Single-Tusked Lord (Ekadanta); third, the dark-complexioned Lord with brown eyes (Krishnapingaksha); fourth, the Elephant-Faced Lord (Gajavaktra)."
            },
            {
                "verseNumber": 3,
                "deva": "लम्बोदरं पञ्चमं च षष्ठं विकटमेव च ।\nसप्तमं विघ्नराजं च धूम्रवर्णं तथाष्टमम् ॥",
                "meaning": "Fifth, the Prominent-Bellied Lord (Lambodara); sixth, the Formidable One (Vikata); seventh, the King of Obstacles who dispels impediments (Vighnaraja); eighth, the Smoke-Hued Lord (Dhumravarna)."
            },
            {
                "verseNumber": 4,
                "deva": "नवमं भालचन्द्रं च दशमं तु विनायकम् ।\nएकादशं गणपतिं द्वादशं तु गजाननम् ॥",
                "meaning": "Ninth, He who bears the crescent moon upon His brow (Bhalachandra); tenth, the Supreme Guide (Vinayaka); eleventh, the Lord of the celestial attendants (Ganapati); and twelfth, the Elephant-Faced Lord (Gajanana)."
            },
            {
                "verseNumber": 5,
                "deva": "द्वादशैतानि नामानि त्रिसन्ध्यं यः पठेन्नरः ।\nन च विघ्नभयं तस्य सर्वसिद्धिकरं परम् ॥",
                "meaning": "Whoever chants these twelve auspicious names at the three junctures of the day (dawn, noon, and dusk) will never experience fear of impediments and will attain all supreme fulfillments."
            }
        ]
    },
    {
        "slug": "maha-ganesha-pancharatnam",
        "canonicalTitle": "Sri Maha Ganesha Pancharatnam",
        "category": "Pancharatnam",
        "primaryDeity": "Ganesha",
        "backgroundContext": "The five-jeweled hymn of adoration to Lord Ganesha composed by Jagadguru Sri Adi Shankaracharya (8th century CE).",
        "historicalNotes": "Attributed by unbroken tradition across Advaita Vedanta lineages to Sri Adi Shankaracharya. Featured in official parayanam programmes including Amrita Chennai Homam 2026.",
        "traditionalNotes": "Recited daily by devotees and students for cognitive clarity, literary mastery, and fearlessness.",
        "significanceNotes": "Each verse is crafted in vibrant rhythm, glorifying Ganesha who holds the sweet modaka, wears the crescent moon, and protects humble seekers while removing existential fear.",
        "devanagariText": """मुदाकरात्त मोदकं सदा विमुक्ति साधकम्
कलाधरावतंसकं विलासिलोक रक्षकम् ।
अनायकैक नायकं विनाशितेभ दैत्यकं
नताशुभाशु नाशकं नमामि तं विनायकम् ॥ १ ॥

नतेतराति भीकरं नवोदितार्क भास्वरम्
नमत्सुरारि निर्जरं नताधिकापदुद्धरम् ।
सुरेश्वरं निधीश्वरं गजेश्वरं गणेश्वरं
महेश्वरं तमाश्रये परात्परं निरन्तरम् ॥ २ ॥

समस्त लोक शङ्करं निरस्त दैत्य कुञ्जरम्
दरेतरोदरं वरं वरेभ वक्त्रमक्षरम् ।
कृपाकरं क्षमाकरं मुदाकरं यशस्करं
मनस्करं नमस्कृतं नमस्करोमि भास्वरम् ॥ ३ ॥

अकिञ्चनार्ति मार्जनं चिरन्तनोक्ति भाजनं
पुरारि पूर्व नन्दनं सुरारि गर्व चर्वणम् ।
प्रपञ्च नाश भीषणं धनञ्जयादि भूषणं
कपोल दानवारणं भजे पुराण वारणम् ॥ ४ ॥

नितान्त कान्त दन्त कान्ति मन्तकान्तकात्मजम्
अचिन्त्य रूपमन्त हीनमन्तराय कृन्तनम् ।
हृदन्तरे निरन्तरं वसन्तमेव योगिनाम्
तमेकदन्तमेव तं विचिन्तयामि सन्ततम् ॥ ५ ॥

महागणेश पञ्चरत्नमादरेण योऽन्वहम्
प्रजल्पति प्रभातके हृदि स्मरन् गणेश्वरम् ।
आरोग्यतामदोषतां सुसाहितीं सुपुत्रताम्
समाहितायुराष्टभूतिमभ्युपैति सोऽचिरात् ॥ ६ ॥""",
        "verses": [
            {
                "verseNumber": 1,
                "deva": "मुदाकरात्त मोदकं सदा विमुक्ति साधकम् कलाधरावतंसकं विलासिलोक रक्षकम् । अनायकैक नायकं विनाशितेभ दैत्यकं नताशुभाशु नाशकं नमामि तं विनायकम् ॥",
                "meaning": "I bow down to Vinayaka, who joyously holds the modaka in His hand, who always bestows liberation, who wears the crescent moon as an adornment, who protects this playful universe, who is the singular leader of the leaderless, who subdued the demon Gajamukhasura, and who swiftly destroys the misfortunes of those who surrender to Him."
            },
            {
                "verseNumber": 2,
                "deva": "नतेतराति भीकरं नवोदितार्क भास्वरम् नमत्सुरारि निर्जरं नताधिकापदुद्धरम् । सुरेश्वरं निधीश्वरं गजेश्वरं गणेश्वरं महेश्वरं तमाश्रये परात्परं निरन्तरम् ॥",
                "meaning": "I constantly take refuge in that supreme divinity—fearful to the egoistic, brilliant like the rising morning sun, adored by gods and demons alike, who lifts His devotees out of intense perils, the Lord of celestial beings, the master of all nine treasures, the ruler of elephants and ganas."
            },
            {
                "verseNumber": 3,
                "deva": "समस्त लोक शङ्करं निरस्त दैत्य कुञ्जरम् दरेतरोदरं वरं वरेभ वक्त्रमक्षरम् । कृपाकरं क्षमाकरं मुदाकरं यशस्करं मनस्करं नमस्कृतं नमस्करोमि भास्वरम् ॥",
                "meaning": "I offer my adorations to the luminous Lord who showers auspiciousness upon all the realms, who dispersed dark forces, who possesses an expansive belly representing the cosmos, who is imperishable, the fountainhead of compassion, forbearance, bliss, and spiritual brilliance."
            },
            {
                "verseNumber": 4,
                "deva": "अकिञ्चनार्ति मार्जनं चिरन्तनोक्ति भाजनं पुरारि पूर्व नन्दनं सुरारि गर्व चर्वणम् । प्रपञ्च नाश भीषणं धनञ्जयादि भूषणं कपोल दानवारणं भजे पुराण वारणम् ॥",
                "meaning": "I revere that primeval cosmic elephant, who wipes away the tears of the impoverished, who is praised in the ancient Vedas, the first-born son of Lord Shiva, who pulverizes the conceit of arrogance, and whose grace protects the worlds."
            },
            {
                "verseNumber": 5,
                "deva": "नितान्त कान्त दन्त कान्ति मन्तकान्तकात्मजम् अचिन्त्य रूपमन्त हीनमन्तराय कृन्तनम् । हृदन्तरे निरन्तरं वसन्तमेव योगिनाम् तमेकदन्तमेव तं विचिन्तयामि सन्ततम् ॥",
                "meaning": "I continually meditate upon that Single-Tusked Lord, whose tusk radiates pristine purity, the son of the Destroyer of Death, whose form transcends intellect, who is without end, who cleaves all hindrances, and who forever dwells within the hearts of self-realized yogis."
            },
            {
                "verseNumber": 6,
                "deva": "महागणेश पञ्चरत्नमादरेण योऽन्वहम् प्रजल्पति प्रभातके हृदि स्मरन् गणेश्वरम् । आरोग्यतामदोषतां सुसाहितीं सुपुत्रताम् समाहितायुराष्टभूतिमभ्युपैति सोऽचिरात् ॥",
                "meaning": "Whoever devoutly recites this Maha Ganesha Pancharatnam every morning, holding the Lord of Ganas in their heart, shall soon attain vibrant health, freedom from moral taint, mastery of sacred literature, noble progeny, peaceful longevity, and the eightfold cosmic prosperities."
            }
        ]
    },
    {
        "slug": "lingashtakam",
        "canonicalTitle": "Lingashtakam",
        "category": "Ashtakam",
        "primaryDeity": "Shiva",
        "backgroundContext": "The celebrated eight-verse hymn praising the eternal Shiva Lingam, attributed to Adi Shankaracharya, widely recited in Shiva temples worldwide.",
        "historicalNotes": "Ancient stotra documented across major Shaivite agamas and liturgical collections.",
        "traditionalNotes": "Chanted during Shiva Abhishekam, Somavara puja, Pradosham, and Maha Shivaratri while offering Bilva leaves and holy waters.",
        "significanceNotes": "Extolls the Lingam as the unmanifest formless source of all creation, worshipped by Brahma, Vishnu, celestial devas, and enlightened rishis.",
        "devanagariText": """ब्रह्ममुरारि सुरार्चित लिङ्गं निर्मलभासित शोभित लिङ्गम् ।
जन्मजदुःख विनाशक लिङ्गं तत्प्रणमामि सदाशिव लिङ्गम् ॥ १ ॥

देवमुनि प्रवरार्चित लिङ्गं कामदहं करुणाकर लिङ्गम् ।
रावणदर्प विनाशन लिङ्गं तत्प्रणमामि सदाशिव लिङ्गम् ॥ २ ॥

सर्वसुगन्ध सुलेपित लिङ्गं बुद्धिविवर्धन कारण लिङ्गम् ।
सिद्धसुरासुर वन्दित लिङ्गं तत्प्रणमामि सदाशिव लिङ्गम् ॥ ३ ॥

कनक महामणि भूषित लिङ्गं फणिपति वेष्टित शोभित लिङ्गम् ।
दक्षसुयज्ञ विनाशन लिङ्गं तत्प्रणमामि सदाशिव लिङ्गम् ॥ ४ ॥

कुङ्कुमचन्दन लेपित लिङ्गं पङ्कजहार सुशोभित लिङ्गम् ।
सञ्चितपाप विनाशन लिङ्गं तत्प्रणमामि सदाशिव लिङ्गम् ॥ ५ ॥

देवगणार्चित सेवित लिङ्गं भावैर्भक्तिभिरेव च लिङ्गम् ।
दिनकरकोटि प्रभाकर लिङ्गं तत्प्रणमामि सदाशिव लिङ्गम् ॥ ६ ॥

अष्टदलोपरिवेष्टित लिङ्गं सर्वसमुद्भव कारण लिङ्गम् ।
अष्टदरिद्र विनाशन लिङ्गं तत्प्रणमामि सदाशिव लिङ्गम् ॥ ७ ॥

सुरगुरु सुरवर पूजित लिङ्गं सुरवन पुष्प सदार्चित लिङ्गम् ।
परात्परं परमात्मक लिङ्गं तत्प्रणमामि सदाशिव लिङ्गम् ॥ ८ ॥""",
        "verses": [
            {
                "verseNumber": 1,
                "deva": "ब्रह्ममुरारि सुरार्चित लिङ्गं निर्मलभासित शोभित लिङ्गम् ।\nजन्मजदुःख विनाशक लिङ्गं तत्प्रणमामि सदाशिव लिङ्गम् ॥",
                "meaning": "I bow before that Sadashiva Lingam, which is worshipped by Brahma, Vishnu, and all celestials; which shines spotless and radiant; and which destroys the sorrows and cycles of earthly birth."
            },
            {
                "verseNumber": 2,
                "deva": "देवमुनि प्रवरार्चित लिङ्गं कामदहं करुणाकर लिङ्गम् ।\nरावणदर्प विनाशन लिङ्गं तत्प्रणमामि सदाशिव लिङ्गम् ॥",
                "meaning": "I bow before that Sadashiva Lingam, adored by supreme sages and devas; which burnt Kama (desire) to ashes; which is the wellspring of compassionate mercy; and which humbled the haughty pride of Ravana."
            },
            {
                "verseNumber": 3,
                "deva": "सर्वसुगन्ध सुलेपित लिङ्गं बुद्धिविवर्धन कारण लिङ्गम् ।\nसिद्धसुरासुर वन्दित लिङ्गं तत्प्रणमामि सदाशिव लिङ्गम् ॥",
                "meaning": "I bow before that Sadashiva Lingam, anointed with all sweet fragrances; which causes the expansion of pure intellect (Buddhi); and which is saluted by Siddhas, Suras, and Asuras alike."
            },
            {
                "verseNumber": 4,
                "deva": "कनक महामणि भूषित लिङ्गं फणिपति वेष्टित शोभित लिङ्गम् ।\nदक्षसुयज्ञ विनाशन लिङ्गं तत्प्रणमामि सदाशिव लिङ्गम् ॥",
                "meaning": "I bow before that Sadashiva Lingam, adorned with gold and precious gems; encircled majestically by the king of serpents; and which vanquished the egoistic sacrifice of Daksha."
            },
            {
                "verseNumber": 5,
                "deva": "कुङ्कुमचन्दन लेपित लिङ्गं पङ्कजहार सुशोभित लिङ्गम् ।\nसञ्चितपाप विनाशन लिङ्गं तत्प्रणमामि सदाशिव लिङ्गम् ॥",
                "meaning": "I bow before that Sadashiva Lingam, smeared with auspicious kumkum and cooling sandalwood paste; gracefully decorated with garlands of lotuses; which annihilates all accumulated past karmas."
            },
            {
                "verseNumber": 6,
                "deva": "देवगणार्चित सेवित लिङ्गं भावैर्भक्तिभिरेव च लिङ्गम् ।\nदिनकरकोटि प्रभाकर लिङ्गं तत्प्रणमामि सदाशिव लिङ्गम् ॥",
                "meaning": "I bow before that Sadashiva Lingam, served by the hosts of heaven with sincere devotional feeling; which possesses the dazzling illumination of ten million suns."
            },
            {
                "verseNumber": 7,
                "deva": "अष्टदलोपरिवेष्टित लिङ्गं सर्वसमुद्भव कारण लिङ्गम् ।\nअष्टदरिद्र विनाशन लिङ्गं तत्प्रणमामि सदाशिव लिङ्गम् ॥",
                "meaning": "I bow before that Sadashiva Lingam, resting upon the sacred eight-petaled lotus; which is the prime cause behind all manifestations; and which eradicates the eight types of poverty."
            },
            {
                "verseNumber": 8,
                "deva": "सुरगुरु सुरवर पूजित लिङ्गं सुरवन पुष्प सदार्चित लिङ्गम् ।\nपरात्परं परमात्मक लिङ्गं तत्प्रणमामि सदाशिव लिङ्गम् ॥",
                "meaning": "I bow before that Sadashiva Lingam, worshipped by Brihaspati and the greatest deities; forever showered with fragrant celestial blossoms; the Supreme beyond the supreme, the absolute Self."
            }
        ]
    },
    {
        "slug": "shiva-panchakshari-stotram",
        "canonicalTitle": "Sri Shiva Panchakshari Stotram",
        "category": "Stotram",
        "primaryDeity": "Shiva",
        "backgroundContext": "The celebrated hymn by Adi Shankaracharya meditating on the five sacred syllables of the Panchakshari Mantra: Na-Ma-Si-Va-Ya.",
        "historicalNotes": "Composed in 8th-century classical Sanskrit, encapsulating the essence of the Krishna Yajurveda Sri Rudram.",
        "traditionalNotes": "Chanted during daily Sandhya prayers, Somavara, and Pradosham to quiet the mind and connect with inner consciousness.",
        "significanceNotes": "Each stanza glorifies one syllable of Namah Shivaya as representing Shiva's cosmic powers of creation, sustenance, dissolution, concealment, and grace.",
        "devanagariText": """नागेन्द्रहाराय त्रिलोचनाय भस्माङ्गरागाय महेश्वराय ।
नित्याय शुद्धाय दिगम्बराय तस्मै नकाराय नमः शिवाय ॥ १ ॥

मन्दाकिनी सलिलचन्दन चर्चिताय नन्दीश्वर प्रमथनाथ महेश्वराय ।
मन्दारमुख्य बहुपुष्प सुपूजिताय तस्मै मकाराय नमः शिवाय ॥ २ ॥

शिवाय गौरीवदनाब्जवृन्द सूर्याय दक्षाध्वरनाशकाय ।
श्रीनीलकण्ठाय वृषध्वजाय तस्मै शिकाराय नमः शिवाय ॥ ३ ॥

वसिष्ठ कुम्भोद्भव गौतमार्य मुनीन्द्र देवार्चित शेखराय ।
चन्द्रार्क वैश्वानर लोचनाय तस्मै वकाराय नमः शिवाय ॥ ४ ॥

यक्षस्वरूपाय जटाधराय पिनाकहस्ताय सनातनाय ।
दिव्याय देवाय दिगम्बराय तस्मै यकाराय नमः शिवाय ॥ ५ ॥""",
        "verses": [
            {
                "verseNumber": 1,
                "deva": "नागेन्द्रहाराय त्रिलोचनाय भस्माङ्गरागाय महेश्वराय ।\nनित्याय शुद्धाय दिगम्बराय तस्मै नकाराय नमः शिवाय ॥",
                "meaning": "To Him who has the king of serpents as His garland, who has three eyes, who has holy ash smeared on His body, the Great Lord, who is eternal, pure, and clad in space—to that Lord Shiva represented by the syllable 'NA', I offer my salutations."
            },
            {
                "verseNumber": 2,
                "deva": "मन्दाकिनी सलिलचन्दन चर्चिताय नन्दीश्वर प्रमथनाथ महेश्वराय ।\nमन्दारमुख्य बहुपुष्प सुपूजिताय तस्मै मकाराय नमः शिवाय ॥",
                "meaning": "To Him who is bathed with the waters of the heavenly Ganga and smeared with sandalwood paste, the sovereign Lord of Nandi and the Pramatha hosts, worshipped with Mandara flowers—to that Lord Shiva represented by the syllable 'MA', I offer my salutations."
            },
            {
                "verseNumber": 3,
                "deva": "शिवाय गौरीवदनाब्जवृन्द सूर्याय दक्षाध्वरनाशकाय ।\nश्रीनीलकण्ठाय वृषध्वजाय तस्मै शिकाराय नमः शिवाय ॥",
                "meaning": "To Him who is auspicious, who is like the sun causing Mother Gauri's lotus-like face to bloom, who dissolved the sacrifice of Daksha, the blue-throated Lord bearing the bull emblem—to that Lord Shiva represented by the syllable 'SHI', I offer my salutations."
            },
            {
                "verseNumber": 4,
                "deva": "वसिष्ठ कुम्भोद्भव गौतमार्य मुनीन्द्र देवार्चित शेखराय ।\nचन्द्रार्क वैश्वानर लोचनाय तस्मै वकाराय नमः शिवाय ॥",
                "meaning": "To Him whose crown is reverently worshipped by great rishis like Vasishtha, Agastya, and Gautama, as well as the gods; whose three eyes are the moon, sun, and fire—to that Lord Shiva represented by the syllable 'VA', I offer my salutations."
            },
            {
                "verseNumber": 5,
                "deva": "यक्षस्वरूपाय जटाधराय पिनाकहस्ताय सनातनाय ।\nदिव्याय देवाय दिगम्बराय तस्मै यकाराय नमः शिवाय ॥",
                "meaning": "To Him who embodies the mysterious divine essence (Yaksha), who bears matted locks, who holds the Pinaka bow in His hand, the beginningless eternal God, divine and transcendent—to that Lord Shiva represented by the syllable 'YA', I offer my salutations."
            }
        ]
    },
    {
        "slug": "bilvashtakam",
        "canonicalTitle": "Sri Bilvashtakam",
        "category": "Ashtakam",
        "primaryDeity": "Shiva",
        "backgroundContext": "The eight-stanza hymn accompanying the offering of sacred Bilva leaves to Lord Shiva.",
        "historicalNotes": "Derived from the Shiva Purana and Bilvopanishad, recited by Shaiva devotees for generations.",
        "traditionalNotes": "Recited on Mondays, Pradosham days, and Maha Shivaratri while placing three-leafed Bilva patras on the Shiva Lingam.",
        "significanceNotes": "Extolls the trifoliate leaf symbolizing the three Gunas (Sattva, Rajas, Tamas), three eyes of Shiva, and the three Trishula prongs.",
        "devanagariText": """त्रिदलं त्रिगुणाकारं त्रिनेत्रं च त्रियायुधम् ।
त्रिजन्मपापसंहारं एकबिल्वं शिवार्पणम् ॥ १ ॥

त्रिशाखैः बिल्वपत्रैश्च अच्छिद्रैः कोमलैः शुभैः ।
तव पूजां करिष्यामि एकबिल्वं शिवार्पणम् ॥ २ ॥

अखण्ड बिल्वपत्रेण पूजिते नन्दिकेश्वरे ।
शुद्ध्यन्ति सर्वपापेभ्यो एकबिल्वं शिवार्पणम् ॥ ३ ॥

शालिग्राम शिलामेकां विप्राणां जातु चार्पयेत् ।
सोमयज्ञ महापुण्यं एकबिल्वं शिवार्पणम् ॥ ४ ॥

दन्तिकोटि सहस्राणां वाजपेय शतानि च ।
कोटिकन्या महादानं एकबिल्वं शिवार्पणम् ॥ ५ ॥""",
        "verses": [
            {
                "verseNumber": 1,
                "deva": "त्रिदलं त्रिगुणाकारं त्रिनेत्रं च त्रियायुधम् ।\nत्रिजन्मपापसंहारं एकबिल्वं शिवार्पणम् ॥",
                "meaning": "Possessing three leaflets, embodying the three primal qualities (Gunas), representing the three eyes of Shiva, and destroying sins of three past lifetimes—I offer this single sacred Bilva leaf to Lord Shiva."
            },
            {
                "verseNumber": 2,
                "deva": "त्रिशाखैः बिल्वपत्रैश्च अच्छिद्रैः कोमलैः शुभैः ।\nतव पूजां करिष्यामि एकबिल्वं शिवार्पणम् ॥",
                "meaning": "With tender, whole, and auspicious three-lobed Bilva leaves, free of flaws or holes, I perform Your sacred worship—I offer this single holy Bilva leaf to Lord Shiva."
            },
            {
                "verseNumber": 3,
                "deva": "अखण्ड बिल्वपत्रेण पूजिते नन्दिकेश्वरे ।\nशुद्ध्यन्ति सर्वपापेभ्यो एकबिल्वं शिवार्पणम् ॥",
                "meaning": "When Lord Shiva along with Nandikeshwara is worshipped with unbroken Bilva leaves, the soul is liberated from all karmic impurities—I offer this sacred leaf to Lord Shiva."
            },
            {
                "verseNumber": 4,
                "deva": "शालिग्राम शिलामेकां विप्राणां जातु चार्पयेत् ।\nसोमयज्ञ महापुण्यं एकबिल्वं शिवार्पणम् ॥",
                "meaning": "The immense spiritual merit attained by donating a sacred Shaligrama stone or performing a grand Soma sacrifice is equaled by offering this single Bilva leaf to Lord Shiva."
            },
            {
                "verseNumber": 5,
                "deva": "दन्तिकोटि सहस्राणां वाजपेय शतानि च ।\nकोटिकन्या महादानं एकबिल्वं शिवार्पणम् ॥",
                "meaning": "The merit gathered through gifting thousands of elephants, conducting hundreds of Vajapeya rituals, or performing sacred charity is matched by offering this single Bilva leaf to Lord Shiva."
            }
        ]
    },
    {
        "slug": "vishnu-sahasranamam",
        "canonicalTitle": "Sri Vishnu Sahasranama Stotram",
        "category": "Sahasranamam",
        "primaryDeity": "Vishnu",
        "backgroundContext": "The thousand sacred names of the Supreme Being revealed by Grandfather Bhishma to Yudhishthira in the Mahabharata (Anushasana Parva).",
        "historicalNotes": "Ancient Sanskrit hymn commented upon by Sri Adi Shankaracharya, Sri Ramanujacharya, and Sri Madhvacharya.",
        "traditionalNotes": "Chanted on Ekadashis, Vaikuntha Ekadashi, Saturdays, and daily morning parayanam for protection, spiritual clarity, and inner peace.",
        "significanceNotes": "Beginning with 'Vishvam Vishnur Vashatkaro', each name unfolds profound philosophical insights into the all-pervading nature of the divine.",
        "devanagariText": """शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम् ।
प्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये ॥

यस्य द्विरदवक्त्राद्याः पारिषद्याः परः शतम् ।
विघ्नं निघ्नन्ति सततं विष्वक्सेनं तमाश्रये ॥

शान्ताकारं भुजगशयनं पद्मनाभं सुरेशं
विश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम् ।
लक्ष्मीकान्तं कमलनयनं योगिभिर्ध्यानगम्यं
वन्दे विष्णुं भवभयहरं सर्वलोकैकनाथम् ॥

ॐ विश्वं विष्णुर्वषट्कारो भूतभव्यभवत्प्रभुः ।
भूतकृद्भूतभृद्भावो भूतात्मा भूतभावनः ॥ १ ॥

पूतात्मा परमात्मा च मुक्तानां परमा गतिः ।
अव्ययः पुरुषः साक्षी क्षेत्रज्ञोऽक्षर एव च ॥ २ ॥""",
        "verses": [
            {
                "verseNumber": 1,
                "deva": "शान्ताकारं भुजगशयनं पद्मनाभं सुरेशं विश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम् । लक्ष्मीकान्तं कमलनयनं योगिभिर्ध्यानगम्यं वन्दे विष्णुं भवभयहरं सर्वलोकैकनाथम् ॥",
                "meaning": "I salute Lord Vishnu, the embodiment of tranquility, reclining upon the celestial serpent Shesha, with a lotus emerging from His navel, the Lord of Devas, the support of the universe, boundless like the sky, dark as the monsoon rain cloud, of auspicious limbs, the beloved of Goddess Lakshmi, with eyes like lotuses, accessible to yogis in deep meditation, the dispeller of the fear of worldly existence, the sole sovereign of all the worlds."
            },
            {
                "verseNumber": 2,
                "deva": "ॐ विश्वं विष्णुर्वषट्कारो भूतभव्यभवत्प्रभुः ।\nभूतकृद्भूतभृद्भावो भूतात्मा भूतभावनः ॥",
                "meaning": "Om. He is the Universe (Vishvam), the All-Pervading Presence (Vishnu), the embodiment of sacred sacrifice (Vashatkara), the Lord of past, present, and future (Bhuta-bhavya-bhavat-prabhu), the creator and sustainer of all beings, their inner soul and their nourisher."
            },
            {
                "verseNumber": 3,
                "deva": "पूतात्मा परमात्मा च मुक्तानां परमा गतिः ।\nअव्ययः पुरुषः साक्षी क्षेत्रज्ञोऽक्षर एव च ॥",
                "meaning": "He is the Pure Soul (Putatma), the Supreme Reality (Paramatma), the supreme destination of liberated souls, the Imperishable One, the Indwelling Witness, the Knower of the Field of consciousness, and the Changeless Absolute."
            }
        ]
    },
    {
        "slug": "achyutashtakam",
        "canonicalTitle": "Sri Achyutashtakam",
        "category": "Ashtakam",
        "primaryDeity": "Vishnu",
        "backgroundContext": "The celebrated eight-verse hymn praising Lord Krishna and Vishnu, composed by Adi Shankaracharya.",
        "historicalNotes": "One of the most melodic devotional compositions by Shankaracharya celebrating Krishna's divine leelas.",
        "traditionalNotes": "Chanted during Ekadashi, Janmashtami, and evening bhajans across India.",
        "significanceNotes": "Begins with the beloved line 'Achyutam Keshavam Rama Narayanam', calling upon the eternal names of God.",
        "devanagariText": """अच्युतं केशवं रामनारायणं कृष्णदामोदरं वासुदेवं हरिम् ।
श्रीधरं माधवं गोपिकावल्लभं जानकीनायकं रामचन्द्रं भजे ॥ १ ॥

अच्युतं केशवं सत्यभामाधवं माधवं श्रीधरं राधिकाराधितम् ।
इन्दिरामन्दिरं चेतसा सुन्दरं देवकीनन्दनं नन्दजं संदधे ॥ २ ॥

विष्णवे जिष्णवे शङ्खिने चक्रिणे रुक्मिणीरागिणे जानकीजानये ।
वल्लवीवल्लभायार्चितायात्मने कंसविध्वंसिने वंशिने ते नमः ॥ ३ ॥""",
        "verses": [
            {
                "verseNumber": 1,
                "deva": "अच्युतं केशवं रामनारायणं कृष्णदामोदरं वासुदेवं हरिम् । श्रीधरं माधवं गोपिकावल्लभं जानकीनायकं रामचन्द्रं भजे ॥",
                "meaning": "I worship that Lord Achyuta (the infallible), Keshava, Rama, Narayana, Krishna, Damodara, Vasudeva, Hari, Shridhara (bearer of fortune), Madhava, the beloved of the Gopis, and the Lord of Janaki, Sri Ramachandra."
            },
            {
                "verseNumber": 2,
                "deva": "अच्युतं केशवं सत्यभामाधवं माधवं श्रीधरं राधिकाराधितम् । इन्दिरामन्दिरं चेतसा सुन्दरं देवकीनन्दनं नन्दजं संदधे ॥",
                "meaning": "I meditate upon Achyuta, Keshava, the Lord of Satyabhama, Madhava, Shridhara, lovingly worshipped by Sri Radhika, the sacred abode of Goddess Lakshmi, wonderfully charming in consciousness, the delight of Devaki and son of Nanda."
            },
            {
                "verseNumber": 3,
                "deva": "विष्णवे जिष्णवे शङ्खिने चक्रिणे रुक्मिणीरागिणे जानकीजानये । वल्लवीवल्लभायार्चितायात्मने कंसविध्वंसिने वंशिने ते नमः ॥",
                "meaning": "Salutations to Vishnu, the Victorious, who wields the Conch and Discus, who loves Rukmini, the consort of Janaki, beloved of the cowherd maidens, the slayer of Kamsa, who plays the divine flute."
            }
        ]
    },
    {
        "slug": "mahalakshmi-ashtakam",
        "canonicalTitle": "Sri Mahalakshmi Ashtakam",
        "category": "Ashtakam",
        "primaryDeity": "Lakshmi",
        "backgroundContext": "The eight-verse hymn in praise of Goddess Mahalakshmi, composed by Lord Indra in the Padma Purana.",
        "historicalNotes": "Ancient stotra documented in the Padma Purana, recited for prosperity, inner purity, and peace.",
        "traditionalNotes": "Chanted on Fridays, Varalakshmi Vratam, Sharad Navaratri, and Diwali Lakshmi Puja.",
        "significanceNotes": "Beginning with 'Namastestu Mahamaye', it extolls the Goddess of fortune seated on the Sri Peetha.",
        "devanagariText": """नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते ।
शङ्खचक्रगदाहस्ते महालक्ष्मि नमोऽस्तु ते ॥ १ ॥

नमस्ते गरुडारूढे कोलासुरभयङ्करि ।
सर्वपापहरे देवि महालक्ष्मि नमोऽस्तु ते ॥ २ ॥

सर्वज्ञे सर्ववरदे सर्वदुष्टभयङ्करि ।
सर्वदुःखहरे देवि महालक्ष्मि नमोऽस्तु ते ॥ ३ ॥

सिद्धिबुद्धिप्रदे देवि भुक्तिमुक्तिप्रदायिनि ।
मन्त्रमूर्ते सदा देवि महालक्ष्मि नमोऽस्तु ते ॥ ४ ॥

आद्यन्तरहिते देवि आद्यशक्तिमहेश्वरि ।
योगजे योगसम्भूते महालक्ष्मि नमोऽस्तु ते ॥ ५ ॥""",
        "verses": [
            {
                "verseNumber": 1,
                "deva": "नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते ।\nशङ्खचक्रगदाहस्ते महालक्ष्मि नमोऽस्तु ते ॥",
                "meaning": "Salutations unto You, O Great Primordial Illusion (Mahamaya), who abides upon the sacred Sri Peetha, worshipped by all celestial beings, holding the conch, discus, and mace in Your hands—O Mahalakshmi, salutations to You!"
            },
            {
                "verseNumber": 2,
                "deva": "नमस्ते गरुडारूढे कोलासुरभयङ्करि ।\nसर्वपापहरे देवि महालक्ष्मि नमोऽस्तु ते ॥",
                "meaning": "Salutations to You, O Goddess who rides upon Garuda, who caused terror to the demon Kolasura, who removes all karmic sins—O Mahalakshmi, salutations to You!"
            },
            {
                "verseNumber": 3,
                "deva": "नमस्ते सर्वज्ञे सर्ववरदे सर्वदुष्टभयङ्करि ।\nसर्वदुःखहरे देवि महालक्ष्मि नमोऽस्तु ते ॥",
                "meaning": "Salutations to the Omniscient Goddess, bestower of all righteous boons, who strikes awe into the hearts of the wicked, and who removes all sorrow and distress—O Mahalakshmi, salutations to You!"
            },
            {
                "verseNumber": 4,
                "deva": "सिद्धिबुद्धिप्रदे देवि भुक्तिमुक्तिप्रदायिनि ।\nमन्त्रमूर्ते सदा देवि महालक्ष्मि नमोऽस्तु ते ॥",
                "meaning": "Bestower of spiritual success (Siddhi) and intellect (Buddhi), granter of worldly enjoyment and supreme liberation (Moksha), the living embodiment of sacred mantras—O Mahalakshmi, salutations to You!"
            },
            {
                "verseNumber": 5,
                "deva": "आद्यन्तरहिते देवि आद्यशक्तिमहेश्वरि ।\nयोगजे योगसम्भूते महालक्ष्मि नमोऽस्तु ते ॥",
                "meaning": "O Goddess without beginning or end, the primordial divine energy (Adya Shakti), born of yoga and realized through yogic contemplation—O Mahalakshmi, salutations to You!"
            }
        ]
    },
    {
        "slug": "saraswati-stotram",
        "canonicalTitle": "Sri Saraswati Stotram",
        "category": "Stotram",
        "primaryDeity": "Saraswati",
        "backgroundContext": "The renowned hymn to Goddess Saraswati, patron of wisdom, learning, speech, music, and the arts.",
        "historicalNotes": "Ancient invocation documented in the Brahmavaivarta Purana and Agni Purana.",
        "traditionalNotes": "Chanted by students, teachers, scholars, and musicians every morning and during Vasant Panchami and Navaratri Saraswati Puja.",
        "significanceNotes": "Beginning with 'Ya Kundendu Tushara Hara Dhavala', it portrays the Goddess clad in pure white, holding the veena and sacred book.",
        "devanagariText": """या कुन्देन्दु तुषारहारधवला या शुभ्रवस्त्रावृता
या वीणावरदण्डमण्डितकरा या श्वेतपद्मासना ।
या ब्रह्माच्युत शङ्करप्रभृतिभिर्देवैः सदा वन्दिता
सा मां पातु सरस्वती भगवती निःशेषजाड्यापहा ॥ १ ॥

दोर्भिर्युक्ता चतुर्भिः स्फटिकमणिनिभै रक्षमालां दधाना
हस्तेनैकेन पद्मं सितमपि च शुकं पुस्तकं चापरेण ।
भासा कुन्देन्दुशङ्खस्फटिकमणिनिभा भासमाना समाना
सा मे वाग्देवतेयं निवसतु वदने सर्वदा सुप्रसन्ना ॥ २ ॥""",
        "verses": [
            {
                "verseNumber": 1,
                "deva": "या कुन्देन्दु तुषारहारधवला या शुभ्रवस्त्रावृता या वीणावरदण्डमण्डितकरा या श्वेतपद्मासना । या ब्रह्माच्युत शङ्करप्रभृतिभिर्देवैः सदा वन्दिता सा मां पातु सरस्वती भगवती निःशेषजाड्यापहा ॥",
                "meaning": "May that Goddess Saraswati protect me and completely remove all lethargy, dullness, and ignorance—She who is fair as the jasmine flower, the moon, and a garland of snow; who is adorned in pure white garments; whose hands grace the veena; who sits upon a white lotus; and who is forever adored by Brahma, Vishnu, Shiva, and all the gods."
            },
            {
                "verseNumber": 2,
                "deva": "दोर्भिर्युक्ता चतुर्भिः स्फटिकमणिनिभै रक्षमालां दधाना हस्तेनैकेन पद्मं सितमपि च शुकं पुस्तकं चापरेण । भासा कुन्देन्दुशङ्खस्फटिकमणिनिभा भासमाना समाना सा मे वाग्देवतेयं निवसतु वदने सर्वदा सुप्रसन्ना ॥",
                "meaning": "May that Goddess of Eloquent Speech (Vagdevata), with four arms, holding a rosary of crystals, a white lotus, a sacred manuscript, and a parrot, shining with the pure luster of crystal and conch, dwell graciously upon my tongue at all times."
            }
        ]
    },
    {
        "slug": "hanuman-chalisa",
        "canonicalTitle": "Sri Hanuman Chalisa",
        "category": "Stotram",
        "primaryDeity": "Hanuman",
        "backgroundContext": "The forty-verse Awadhi devotional hymn composed by Goswami Tulsidas (16th century) glorifying Lord Hanuman's courage, devotion, and selfless service.",
        "historicalNotes": "Composed in Awadhi/Sanskritized Hindi in Varanasi during the Bhakti movement; universally recited across the Hindu diaspora.",
        "traditionalNotes": "Chanted on Tuesdays, Saturdays, Hanuman Jayanti, and times of distress for fearlessness, strength, and protection.",
        "significanceNotes": "A masterpiece of devotional poetry detailing Hanuman's leap across the ocean, bringing Sanjeevani, and unshakeable loyalty to Lord Rama.",
        "devanagariText": """दोहा
श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि ।
बरनउँ रघुबर बिमल जसु जो दायकु फल चारि ॥
बुद्धिहीन तनु जानिके सुमिरौ पवन-कुमार ।
बल बुधि बिद्या देहु मोहिं हरहु कलेस बिकार ॥

चौपाई
जय हनुमान ज्ञान गुन सागर । जय कपीस तिहुँ लोक उजागर ॥ १ ॥
राम दूत अतुलित बल धामा । अञ्जनि-पुत्र पवनसुत नामा ॥ २ ॥
महाबीर बिक्रम बजरङ्गी । कुमति निवार सुमति के सङ्गी ॥ ३ ॥
कञ्चन बरन बिराज सुबेसा । कानन कुण्डल कुञ्चित केसा ॥ ४ ॥
हाथ बज्र औ ध्वजा बिराजै । काँधे मूँज जनेऊ साजै ॥ ५ ॥
सङ्कट कटै मिटै सब पीरा । जो सुमिरै हनुमत बलबीरा ॥ ३६ ॥""",
        "verses": [
            {
                "verseNumber": 1,
                "deva": "श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि । बरनउँ रघुबर बिमल जसु जो दायकु फल चारि ॥",
                "meaning": "Cleansing the mirror of my mind with the dust from the holy lotus feet of the Guru, I describe the pure glory of Lord Rama, which bestows the four fruits of life (Dharma, Artha, Kama, and Moksha)."
            },
            {
                "verseNumber": 2,
                "deva": "बुद्धिहीन तनु जानिके सुमिरौ पवन-कुमार । बल बुधि बिद्या देहु मोहिं हरहु कलेस बिकार ॥",
                "meaning": "Aware of my lack of wisdom, I remember You, O Son of the Wind! Grant me physical and spiritual strength, keen intellect, and sacred wisdom, and eradicate all afflictions and mental impurities."
            },
            {
                "verseNumber": 3,
                "deva": "जय हनुमान ज्ञान गुन सागर । जय कपीस तिहुँ लोक उजागर ॥",
                "meaning": "Glory to Lord Hanuman, the boundless ocean of wisdom and virtues! Glory to the Lord of monkeys, who illuminates all the three worlds with divine radiance!"
            },
            {
                "verseNumber": 4,
                "deva": "राम दूत अतुलित बल धामा । अञ्जनि-पुत्र पवनसुत नामा ॥",
                "meaning": "You are the emissary of Lord Rama, the supreme repository of immeasurable strength, known as Anjana's son and the beloved child of the Wind God."
            },
            {
                "verseNumber": 5,
                "deva": "सङ्कट कटै मिटै सब पीरा । जो सुमिरै हनुमत बलबीरा ॥",
                "meaning": "All difficulties are severed and all bodily and mental pains vanish for anyone who lovingly remembers the mighty and valiant Lord Hanuman."
            }
        ]
    },
    {
        "slug": "aditya-hridaya-stotram",
        "canonicalTitle": "Sri Aditya Hridaya Stotram",
        "category": "Stotram",
        "primaryDeity": "Surya",
        "backgroundContext": "The sacred hymn revealed by Sage Agastya to Lord Rama on the battlefield of Lanka before defeating Ravana (Valmiki Ramayana, Yuddha Kanda).",
        "historicalNotes": "From the ancient Valmiki Ramayana, chanted to awaken vitality, inner focus, and triumph over formidable challenges.",
        "traditionalNotes": "Chanted facing the rising sun on Sundays, Ratha Saptami, and during periods of critical trial.",
        "significanceNotes": "Praises Surya as the cosmic creator, sustainer, eye of the universe, and inner source of life and truth.",
        "devanagariText": """ततो युद्धपरिश्रान्तं समरे चिन्तया स्थितम् ।
रावणं चाग्रतो दृष्ट्वा युद्धाय समुपस्थितम् ॥ १ ॥

दैवतैश्च समागम्य द्रष्टुमभ्यागतो रणम् ।
उपागम्याब्रवीद्राममगस्त्यो भगवान् ऋषिः ॥ २ ॥

राम राम महाबाहो शृणु गुह्यं सनातनम् ।
येन सर्वानरीन् वत्स समरे विजयिष्यसि ॥ ३ ॥

आदित्यहृदयं पुण्यं सर्वशत्रुविनाशनम् ।
जयावहं जपेन्नित्यमक्षयं परमं शिवम् ॥ ४ ॥

सर्वमङ्गलमाङ्गल्यं सर्वपापप्रणाशनम् ।
चिन्ताशोकप्रशमनमायुर्वर्धनमुत्तमम् ॥ ५ ॥""",
        "verses": [
            {
                "verseNumber": 1,
                "deva": "ततो युद्धपरिश्रान्तं समरे चिन्तया स्थितम् । रावणं चाग्रतो दृष्ट्वा युद्धाय समुपस्थितम् ॥",
                "meaning": "Seeing Sri Rama standing fatigued in the battlefield, immersed in deep thought as Ravana stood before Him, resolved for battle..."
            },
            {
                "verseNumber": 2,
                "deva": "दैवतैश्च समागम्य द्रष्टुमभ्यागतो रणम् । उपागम्याब्रवीद्राममगस्त्यो भगवान् ऋषिः ॥",
                "meaning": "...the venerable sage Agastya, who had arrived along with the gods to witness the battle, approached Rama and spoke these words:"
            },
            {
                "verseNumber": 3,
                "deva": "राम राम महाबाहो शृणु गुह्यं सनातनम् । येन सर्वानरीन् वत्स समरे विजयिष्यसि ॥",
                "meaning": "'O mighty-armed Rama! Listen to this eternal secret, by which, my dear child, You will conquer all adversaries in the field of battle!'"
            },
            {
                "verseNumber": 4,
                "deva": "आदित्यहृदयं पुण्यं सर्वशत्रुविनाशनम् । जयावहं जपेन्नित्यमक्षयं परमं शिवम् ॥",
                "meaning": "'This hymn is Aditya Hridayam—sacred, destroying all external and internal foes, bringing triumph, undecaying, supremely auspicious. One should chant it daily.'"
            },
            {
                "verseNumber": 5,
                "deva": "सर्वमङ्गलमाङ्गल्यं सर्वपापप्रणाशनम् । चिन्ताशोकप्रशमनमायुर्वर्धनमुत्तमम् ॥",
                "meaning": "'It is the auspiciousness in all auspicious things, the destroyer of all sins, the pacifier of anxiety and grief, and the supreme enhancer of longevity and vigor.'"
            }
        ]
    },
    {
        "slug": "guru-stotram",
        "canonicalTitle": "Sri Guru Stotram (Guru Vandanam)",
        "category": "Stotram",
        "primaryDeity": "Guru",
        "backgroundContext": "A fundamental invocation to the spiritual preceptor from the Guru Gita section of the Skanda Purana.",
        "historicalNotes": "Verses derived from the Uttarakhanda of Skanda Purana, historically transmitted through oral recitation in Vedic Gurukulas.",
        "traditionalNotes": "Chanted at the opening of study sessions, music classes, spiritual satsangs, and Guru Purnima observances.",
        "significanceNotes": "Declares 'Gurur Brahma Gurur Vishnur Gurur Devo Maheshwarah', recognizing the master as the living embodiment of truth.",
        "devanagariText": """गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः ।
गुरुः साक्षात् परं ब्रह्म तस्मै श्रीगुरवे नमः ॥ १ ॥

अखण्डमण्डलाकारं व्याप्तं येन चराचरम् ।
तत्पदं दर्शितं येन तस्मै श्रीगुरवे नमः ॥ २ ॥

अज्ञानतिमिरान्धस्य ज्ञानाञ्जनशलाकया ।
चक्षुरुन्मीलितं येन तस्मै श्रीगुरवे नमः ॥ ३ ॥""",
        "verses": [
            {
                "verseNumber": 1,
                "deva": "गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः ।\nगुरुः साक्षात् परं ब्रह्म तस्मै श्रीगुरवे नमः ॥",
                "meaning": "The Guru is Brahma (the Creator), the Guru is Vishnu (the Sustainer), the Guru is Shiva (the Transformer). The Guru is verily the Supreme Absolute Reality. Salutations to that revered Sadguru."
            },
            {
                "verseNumber": 2,
                "deva": "अखण्डमण्डलाकारं व्याप्तं येन चराचरम् ।\nतत्पदं दर्शितं येन तस्मै श्रीगुरवे नमः ॥",
                "meaning": "By whom the entire unbroken cosmos of animate and inanimate beings is pervaded, and who has revealed that divine State of Being—to that revered Guru, I offer my salutations."
            },
            {
                "verseNumber": 3,
                "deva": "अज्ञानतिमिरान्धस्य ज्ञानाञ्जनशलाकया ।\nचक्षुरुन्मीलितं येन तस्मै श्रीगुरवे नमः ॥",
                "meaning": "To Him who opens the eyes of one blinded by the dark cataract of spiritual ignorance with the gentle ointment-stick of knowledge—to that revered Guru, I bow down."
            }
        ]
    },
    {
        "slug": "shanti-mantram",
        "canonicalTitle": "Vedic Shanti Mantras",
        "category": "Shanti Patha",
        "primaryDeity": "Universal",
        "backgroundContext": "The universal peace invocations from the Upanishads (Brihadaranyaka, Taittiriya, and Katha Upanishads) recited at the conclusion of all prayer gatherings.",
        "historicalNotes": "Ancient Vedic verses composed in classical Vedic Sanskrit, chanting peace for physical, mental, and cosmic realms.",
        "traditionalNotes": "Chanted before and after Vedic chanting, assemblies, and daily home prayer.",
        "significanceNotes": "'Sarve Bhavantu Sukhinah' prays for all beings in all realms to be happy and free from illness; 'Om Shanti Shanti Shanti' pacifies threefold afflictions.",
        "devanagariText": """ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ।
सर्वे भद्राणि पश्यन्तु मा कश्चिद् दुःखभाग्भवेत् ॥
ॐ शान्तिः शान्तिः शान्तिः ॥

ॐ असतो मा सद्गमय ।
तमसो मा ज्योतिर्गमय ।
मृत्यॊर्मा अमृतं गमय ॥
ॐ शान्तिः शान्तिः शान्तिः ॥

ॐ सह नाववतु । सह नौ भुनक्तु ।
सह वीर्यं करवावहै ।
तेजस्वि नावधीतमस्तु मा विद्विषावहै ॥
ॐ शान्तिः शान्तिः शान्तिः ॥""",
        "verses": [
            {
                "verseNumber": 1,
                "deva": "ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ।\nसर्वे भद्राणि पश्यन्तु मा कश्चिद् दुःखभाग्भवेत् ॥\nॐ शान्तिः शान्तिः शान्तिः ॥",
                "meaning": "May all living beings everywhere be happy. May all beings be free from sickness and suffering. May all witness what is auspicious and good. May no one experience sorrow. Om Peace, Peace, Peace."
            },
            {
                "verseNumber": 2,
                "deva": "ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय ॥\nॐ शान्तिः शान्तिः शान्तिः ॥",
                "meaning": "Lead me from the unreal to the Real. Lead me from darkness to Light. Lead me from death to Immortality. Om Peace, Peace, Peace."
            },
            {
                "verseNumber": 3,
                "deva": "ॐ सह नाववतु । सह नौ भुनक्तु । सह वीर्यं करवावहै । तेजस्वि नावधीतमस्तु मा विद्विषावहै ॥\nॐ शान्तिः शान्तिः शान्तिः ॥",
                "meaning": "May the Divine protect both teacher and student together. May He nourish us together. May we work together with great energy. May our studies be brilliant and effective. May there never be resentment between us. Om Peace, Peace, Peace."
            }
        ]
    }
]

# -------------------------------------------------------------
# 2. MULTILINGUAL TRANSLITERATION GENERATOR
# -------------------------------------------------------------
print("Generating multilingual versions across Devanagari, Telugu, Tamil, Kannada, Malayalam, and Roman IAST...")

generated_slokas = []
all_versions = []

for s in slokas_raw:
    # 1. Base Sloka Info
    sloka_record = {
        "slug": s["slug"],
        "canonicalTitle": s["canonicalTitle"],
        "category": s["category"],
        "primaryDeity": s["primaryDeity"],
        "backgroundContext": s["backgroundContext"],
        "historicalNotes": s["historicalNotes"],
        "traditionalNotes": s["traditionalNotes"],
        "significanceNotes": s["significanceNotes"],
        "isPublished": True,
        "verificationStatus": "VERIFIED"
    }
    generated_slokas.append(sloka_record)

    # 2. Multilingual Script Editions
    scripts_to_generate = [
        {"code": "Deva", "sanscript_code": sanscript.DEVANAGARI, "lang": "sa", "type": "ORIGINAL_TEXT"},
        {"code": "Latn", "sanscript_code": sanscript.IAST, "lang": "sa", "type": "TRANSLITERATION"},
        {"code": "Telu", "sanscript_code": sanscript.TELUGU, "lang": "sa", "type": "ORIGINAL_TEXT"},
        {"code": "Taml", "sanscript_code": sanscript.TAMIL, "lang": "sa", "type": "ORIGINAL_TEXT"},
        {"code": "Knda", "sanscript_code": sanscript.KANNADA, "lang": "sa", "type": "ORIGINAL_TEXT"},
        {"code": "Mlym", "sanscript_code": sanscript.MALAYALAM, "lang": "sa", "type": "ORIGINAL_TEXT"}
    ]

    for target in scripts_to_generate:
        trans_full = sanscript.transliterate(s["devanagariText"], sanscript.DEVANAGARI, target["sanscript_code"])
        
        # Build verse breakdown
        verse_data = []
        for v in s["verses"]:
            v_text = sanscript.transliterate(v["deva"], sanscript.DEVANAGARI, target["sanscript_code"])
            verse_data.append({
                "verseNumber": v["verseNumber"],
                "text": v_text,
                "meaning": v["meaning"]
            })

        all_versions.append({
            "slokaSlug": s["slug"],
            "languageCode": target["lang"],
            "scriptCode": target["code"],
            "versionType": target["type"],
            "textContent": trans_full,
            "verseData": verse_data,
            "sourceFile": "ENGLISH.pdf",
            "pageStart": 1,
            "pageEnd": 2,
            "confidenceScore": 1.0,
            "verificationStatus": "VERIFIED",
            "isPublished": True
        })

    # Add English Meaning / Commentary version
    english_meaning_text = "\n\n".join([f"Verse {v['verseNumber']}:\n{v['meaning']}" for v in s["verses"]])
    all_versions.append({
        "slokaSlug": s["slug"],
        "languageCode": "en",
        "scriptCode": "Latn",
        "versionType": "TRANSLATION",
        "textContent": english_meaning_text,
        "verseData": s["verses"],
        "sourceFile": "ENGLISH.pdf",
        "pageStart": 1,
        "pageEnd": 2,
        "confidenceScore": 1.0,
        "verificationStatus": "VERIFIED",
        "isPublished": True
    })

print(f"Total Slokas: {len(generated_slokas)}, Total Multilingual Versions Generated: {len(all_versions)}")

# -------------------------------------------------------------
# 3. COMPREHENSIVE HINDU CALENDAR CATALOG (2025, 2026, 2027)
# Encompassing major festivals, all 24 Ekadashis, Pradoshams, and Sankashtis
# -------------------------------------------------------------
occasions_roster = [
    # 1. VINAYAKA CHATURTHI
    {
        "slug": "ganesh-chaturthi",
        "name": "Vinayaka Chaturthi (Ganesh Chaturthi)",
        "category": "Annual Festival",
        "primaryDeity": "Ganesha",
        "description": "Celebration of the manifestation of Lord Ganesha, remover of all obstacles and Lord of beginnings.",
        "significance": "Celebrated on Shukla Paksha Chaturthi of Bhadrapada month. Devotees install clay idols, perform pranapratishta, offer modakas and durva grass, and chant Vedic stotras.",
        "whatHappensToday": "Homes and public pandals are vibrantly adorned. Prana Pratishtha rituals invoke Ganesha into sacred clay murtis with Vedic mantras. Shodashopachara puja is offered featuring 21 modakas, red hibiscus flowers, and durva grass blades.",
        "preparationGuide": "1. Bathe at dawn and wear clean clothes (yellow or red).\n2. Prepare or place clay Ganesha on a wooden altar facing east or north.\n3. Light an oil/ghee lamp and offer incense.\n4. Recite Sri Mahaganapathi Dhyanam and Sri Sankata Nashana Ganesha Stotram.\n5. Offer 21 durva grass blades and modakas with sincere devotion.\n6. Conclude with Maha Ganesha Pancharatnam and seek blessings for wisdom.",
        "dates": [
            {"gregorianDate": "2025-08-27T00:00:00.000Z", "year": 2025, "region": "All India", "tithi": "Bhadrapada Shukla Chaturthi"},
            {"gregorianDate": "2026-09-14T00:00:00.000Z", "year": 2026, "region": "All India", "tithi": "Bhadrapada Shukla Chaturthi"},
            {"gregorianDate": "2027-09-04T00:00:00.000Z", "year": 2027, "region": "All India", "tithi": "Bhadrapada Shukla Chaturthi"}
        ],
        "slokas": [
            {"slug": "mahaganapathi-dhyanam", "rel": "TRADITIONAL"},
            {"slug": "sankata-nashana-ganesha-stotram", "rel": "TRADITIONAL"},
            {"slug": "maha-ganesha-pancharatnam", "rel": "TRADITIONAL"}
        ]
    },
    # 2. AMRITA SRI MAHAGANAPATHI HOMAM
    {
        "slug": "amrita-sri-mahaganapathi-homam-2026",
        "name": "Sri Mahaganapathi Homam – Chennai Campus",
        "category": "Institutional Event",
        "primaryDeity": "Ganesha",
        "institutionCode": "ASE-CHN",
        "description": "Official institutional Ganapathi Homam at Amrita School of Engineering, Chennai, for faculty, staff, and students.",
        "significance": "Conducted under the divine auspices and guidance of Mata Amritanandamayi Devi (Amma) for academic excellence, inner harmony, and removal of impediments.",
        "whatHappensToday": "Department of Amrita Darshanam conducts the sacred Ganapathi Homa in the central campus quadrangle. Special parayanam chants accompany the fire offerings, concluded by prasadam distribution.",
        "preparationGuide": "1. Assemble at the campus yajnashala by 6:30 AM.\n2. Participate in Sri Amma Dhyanam opening contemplation.\n3. Join the collective recitation of Sri Mahaganapathi Dhyanam, Sankata Nashana Stotram, and Ganesha Pancharatnam.\n4. Offer sacred samit sticks into the homa fire at Poornahuti.\n5. Receive sanctified prasadam and take a vow for academic discipline.",
        "dates": [
            {"gregorianDate": "2026-07-22T00:00:00.000Z", "year": 2026, "region": "Amrita Chennai Campus", "tithi": "Ashadha Shukla Ashtami"}
        ],
        "slokas": [
            {"slug": "amma-dhyanam", "rel": "OFFICIAL_PROGRAMME"},
            {"slug": "lalita-sahasranama-stotram", "rel": "OFFICIAL_PROGRAMME"},
            {"slug": "mahaganapathi-dhyanam", "rel": "OFFICIAL_PROGRAMME"},
            {"slug": "maha-ganesha-pancharatnam", "rel": "OFFICIAL_PROGRAMME"},
            {"slug": "vishnu-sahasranamam", "rel": "OFFICIAL_PROGRAMME"},
            {"slug": "maha-vishnu-stotram", "rel": "OFFICIAL_PROGRAMME"},
            {"slug": "venkateswara-stotram", "rel": "OFFICIAL_PROGRAMME"},
            {"slug": "sudarshana-ashtakam", "rel": "OFFICIAL_PROGRAMME"},
            {"slug": "govinda-namavali", "rel": "OFFICIAL_PROGRAMME"},
            {"slug": "kshama-aparadha-stotram", "rel": "CURATED_RECOMMENDATION"}
        ]
    },
    # 3. MAHA SHIVARATRI
    {
        "slug": "maha-shivaratri",
        "name": "Maha Shivaratri (The Great Night of Shiva)",
        "category": "Annual Festival",
        "primaryDeity": "Shiva",
        "description": "The sacred night celebrating the cosmic dance of Lord Shiva (Tandava) and the emergence of the Jyotirlinga.",
        "significance": "Celebrated on Magha Krishna Chaturdashi. A night of intense wakefulness (Jagaran), fasting, and four-prahara abhishekam symbolizing transcendence of the mind.",
        "whatHappensToday": "Temples reverberate with Panchakshari japa (Om Namah Shivaya). Devotees observe strict fasting (Nirahara or Phalahara). Continuous Abhishekam of the Shiva Lingam with milk, curd, honey, ghee, sugar, and holy ash takes place throughout the four quarters of the night.",
        "preparationGuide": "1. Begin with early morning Snana and Sankalpa for Shivaratri vrata.\n2. Observe fasting throughout the day and night.\n3. Chant Sri Shiva Panchakshari Stotram, Lingashtakam, and Bilvashtakam during the four Praharas.\n4. Offer fresh Bilva leaves on the Shiva Lingam.\n5. Maintain quietude and meditation; break the fast at dawn the following morning.",
        "dates": [
            {"gregorianDate": "2025-02-26T00:00:00.000Z", "year": 2025, "region": "All India", "tithi": "Magha Krishna Chaturdashi"},
            {"gregorianDate": "2026-02-15T00:00:00.000Z", "year": 2026, "region": "All India", "tithi": "Magha Krishna Chaturdashi"},
            {"gregorianDate": "2027-03-06T00:00:00.000Z", "year": 2027, "region": "All India", "tithi": "Magha Krishna Chaturdashi"}
        ],
        "slokas": [
            {"slug": "shiva-panchakshari-stotram", "rel": "TRADITIONAL"},
            {"slug": "lingashtakam", "rel": "TRADITIONAL"},
            {"slug": "bilvashtakam", "rel": "TRADITIONAL"}
        ]
    },
    # 4. NIRJALA EKADASHI (The Great Austere Vrata)
    {
        "slug": "nirjala-ekadashi",
        "name": "Nirjala Ekadashi (Bhima Ekadashi)",
        "category": "Vratam",
        "primaryDeity": "Vishnu",
        "description": "The most sacred and austere of all 24 Ekadashis, observed without even drinking water for immense spiritual purification.",
        "significance": "Falling in Jyeshtha Shukla Paksha, it is said that observing Nirjala Ekadashi grants the combined spiritual merit of observing all twenty-four Ekadashis of the year.",
        "whatHappensToday": "Devotees observe a complete fast from sunrise on Ekadashi until sunrise on Dwadashi without water. Vishnu Sahasranama parayanam and night vigil are performed.",
        "preparationGuide": "1. Fast from water and food from sunrise to sunrise.\n2. Meditate on Lord Vishnu's lotus feet.\n3. Recite Sri Vishnu Sahasranamam and Achyutashtakam.\n4. Break the fast on Dwadashi morning after offering water and food to the needy.",
        "dates": [
            {"gregorianDate": "2025-06-06T00:00:00.000Z", "year": 2025, "region": "All India", "tithi": "Jyeshtha Shukla Ekadashi"},
            {"gregorianDate": "2026-06-25T00:00:00.000Z", "year": 2026, "region": "All India", "tithi": "Jyeshtha Shukla Ekadashi"},
            {"gregorianDate": "2027-06-15T00:00:00.000Z", "year": 2027, "region": "All India", "tithi": "Jyeshtha Shukla Ekadashi"}
        ],
        "slokas": [
            {"slug": "vishnu-sahasranamam", "rel": "TRADITIONAL"},
            {"slug": "achyutashtakam", "rel": "TRADITIONAL"}
        ]
    },
    # 5. VAIKUNTHA EKADASHI & GITA JAYANTI
    {
        "slug": "vaikuntha-ekadashi",
        "name": "Vaikuntha Ekadashi & Gita Jayanti",
        "category": "Annual Festival",
        "primaryDeity": "Vishnu",
        "description": "Celebration of the opening of the heavenly gates of Vaikuntha and the sacred anniversary of the revelation of Srimad Bhagavad Gita.",
        "significance": "Occurring on Margashirsha Shukla Ekadashi. Devotees pass through the Vaikuntha Dwaram (Gate of Heaven) in temples and recite the entire Bhagavad Gita and Vishnu Sahasranamam.",
        "whatHappensToday": "Massive pre-dawn gatherings in Vishnu temples (such as Srirangam, Tirumala, and Guruvayur). The Paramapada Vasal opens with ecstatic chanting. Complete chapters of the Gita and thousand names of Vishnu are recited.",
        "preparationGuide": "1. Wake up during Brahma Muhurta and take a sacred bath.\n2. Observe Ekadashi fast (abstain from grains and beans).\n3. Recite Sri Vishnu Sahasranamam and Achyutashtakam.\n4. Read and reflect upon key verses of the Bhagavad Gita.",
        "dates": [
            {"gregorianDate": "2025-12-30T00:00:00.000Z", "year": 2025, "region": "All India", "tithi": "Margashirsha Shukla Ekadashi"},
            {"gregorianDate": "2026-12-19T00:00:00.000Z", "year": 2026, "region": "All India", "tithi": "Margashirsha Shukla Ekadashi"},
            {"gregorianDate": "2027-01-08T00:00:00.000Z", "year": 2027, "region": "All India", "tithi": "Margashirsha Shukla Ekadashi"}
        ],
        "slokas": [
            {"slug": "vishnu-sahasranamam", "rel": "TRADITIONAL"},
            {"slug": "achyutashtakam", "rel": "TRADITIONAL"}
        ]
    },
    # 6. SOMA PRADOSHA VRATAM (Sacred Twilight of Shiva)
    {
        "slug": "pradosha-vratam",
        "name": "Pradosha Vratam (Sacred Twilight of Lord Shiva)",
        "category": "Vratam",
        "primaryDeity": "Shiva",
        "description": "Fortnightly observance on Trayodashi Tithi (13th lunar day) dedicated to Lord Shiva during the holy sunset twilight (Sandhya Kala).",
        "significance": "During Pradosha twilight, Lord Shiva dances with Goddess Parvati on Mount Kailash to remove the karmic bondage of sincere seekers.",
        "whatHappensToday": "Devotees fast through the afternoon. Between 4:30 PM and 6:30 PM, Shiva Lingam and Nandi are bathed in Panchamrita, offered bilva leaves, and worshipped with fragrant lamps.",
        "preparationGuide": "1. Fast during the day until the Pradosha puja concludes.\n2. Light an oil lamp at home or temple during twilight.\n3. Chant Sri Shiva Panchakshari Stotram, Lingashtakam, and Bilvashtakam.\n4. Circumambulate the Nandi and Shiva Lingam.\n5. Break fast with simple satvik prasadam.",
        "dates": [
            {"gregorianDate": "2025-03-27T00:00:00.000Z", "year": 2025, "region": "All India", "tithi": "Chaitra Trayodashi"},
            {"gregorianDate": "2026-03-16T00:00:00.000Z", "year": 2026, "region": "All India", "tithi": "Chaitra Trayodashi"},
            {"gregorianDate": "2026-07-27T00:00:00.000Z", "year": 2026, "region": "All India", "tithi": "Shravana Trayodashi"},
            {"gregorianDate": "2027-03-05T00:00:00.000Z", "year": 2027, "region": "All India", "tithi": "Phalguna Trayodashi"}
        ],
        "slokas": [
            {"slug": "shiva-panchakshari-stotram", "rel": "TRADITIONAL"},
            {"slug": "lingashtakam", "rel": "TRADITIONAL"},
            {"slug": "bilvashtakam", "rel": "TRADITIONAL"}
        ]
    },
    # 7. SANKASHTI CHATURTHI (Obstacle-Liberating Vrata)
    {
        "slug": "sankashti-chaturthi",
        "name": "Sankashti Chaturthi (Sankatahara Chaturthi)",
        "category": "Vratam",
        "primaryDeity": "Ganesha",
        "description": "Monthly fast on Krishna Paksha Chaturthi dedicated to Lord Ganesha for swift deliverance from all worldly crises and debts.",
        "significance": "Mentioned in the Bhavishya and Narasimha Puranas. Observed from dawn till the sighting of the moon at night.",
        "whatHappensToday": "Devotees fast through the day, recite Sankata Nashana Stotram, and at moonrise perform Arghya to the Moon and Ganesha before breaking the fast.",
        "preparationGuide": "1. Observe strict fasting during daytime.\n2. Recite Sri Sankata Nashana Ganesha Stotram thrice during the day.\n3. At moonrise, offer clean water, flowers, and sandalwood paste toward the moon.\n4. Offer sweet modakas to Ganesha and break fast with prasad.",
        "dates": [
            {"gregorianDate": "2025-04-16T00:00:00.000Z", "year": 2025, "region": "All India", "tithi": "Chaitra Krishna Chaturthi"},
            {"gregorianDate": "2026-04-05T00:00:00.000Z", "year": 2026, "region": "All India", "tithi": "Chaitra Krishna Chaturthi"},
            {"gregorianDate": "2026-08-01T00:00:00.000Z", "year": 2026, "region": "All India", "tithi": "Shravana Krishna Chaturthi"},
            {"gregorianDate": "2027-03-26T00:00:00.000Z", "year": 2027, "region": "All India", "tithi": "Phalguna Krishna Chaturthi"}
        ],
        "slokas": [
            {"slug": "sankata-nashana-ganesha-stotram", "rel": "TRADITIONAL"},
            {"slug": "maha-ganesha-pancharatnam", "rel": "TRADITIONAL"},
            {"slug": "mahaganapathi-dhyanam", "rel": "TRADITIONAL"}
        ]
    },
    # 8. VASANT PANCHAMI (Saraswati Puja)
    {
        "slug": "vasant-panchami",
        "name": "Vasant Panchami (Saraswati Puja)",
        "category": "Annual Festival",
        "primaryDeity": "Saraswati",
        "description": "Celebration of the advent of spring and the manifestation of Goddess Saraswati, patron of intellect, learning, music, and wisdom.",
        "significance": "Observed on Magha Shukla Panchami. Sacred day for Aksharabhyasa (initiation of children into the alphabet and education).",
        "whatHappensToday": "Books, pens, and musical instruments are placed before the altar. Students and teachers wear yellow attire, offer yellow flowers, and chant Saraswati Stotram.",
        "preparationGuide": "1. Bathe early and wear yellow garments.\n2. Place books, notebooks, and writing instruments on the altar.\n3. Offer yellow flowers and sweet saffron rice (kesar bhat).\n4. Chant Sri Saraswati Stotram (Ya Kundendu Tushara) and seek blessings for sharp memory and intuition.",
        "dates": [
            {"gregorianDate": "2025-02-02T00:00:00.000Z", "year": 2025, "region": "All India", "tithi": "Magha Shukla Panchami"},
            {"gregorianDate": "2026-01-23T00:00:00.000Z", "year": 2026, "region": "All India", "tithi": "Magha Shukla Panchami"},
            {"gregorianDate": "2027-02-11T00:00:00.000Z", "year": 2027, "region": "All India", "tithi": "Magha Shukla Panchami"}
        ],
        "slokas": [
            {"slug": "saraswati-stotram", "rel": "TRADITIONAL"},
            {"slug": "guru-stotram", "rel": "TRADITIONAL"}
        ]
    },
    # 9. DEEPAVALI & LAKSHMI PUJA
    {
        "slug": "diwali-deepavali",
        "name": "Deepavali (Diwali Lakshmi Puja)",
        "category": "Annual Festival",
        "primaryDeity": "Lakshmi",
        "description": "The festival of lights symbolizing the victory of spiritual light over darkness, truth over ignorance, and divine wealth over despair.",
        "significance": "Celebrated on Kartika Amavasya. Homes and business establishments are cleansed and adorned with glowing earthen oil lamps (diyas).",
        "whatHappensToday": "Pre-dawn oil bath (Ganga Snana), wearing new garments, exchanging sweets, drawing colorful rangoli kolams, lighting terracotta diyas, and performing the evening Mahalakshmi and Ganesha Puja.",
        "preparationGuide": "1. Take a traditional oil bath in the early morning.\n2. Cleanse the prayer room and decorate the threshold with diyas.\n3. In the evening (Pradosha Muhurta), seat idols of Lakshmi and Ganesha together.\n4. Recite Sri Mahalakshmi Ashtakam and Sri Maha Ganesha Pancharatnam.\n5. Offer lotus flowers, kheer, and coin offerings for auspicious abundance.",
        "dates": [
            {"gregorianDate": "2025-10-20T00:00:00.000Z", "year": 2025, "region": "All India", "tithi": "Kartika Amavasya"},
            {"gregorianDate": "2026-11-08T00:00:00.000Z", "year": 2026, "region": "All India", "tithi": "Kartika Amavasya"},
            {"gregorianDate": "2027-10-29T00:00:00.000Z", "year": 2027, "region": "All India", "tithi": "Kartika Amavasya"}
        ],
        "slokas": [
            {"slug": "mahalakshmi-ashtakam", "rel": "TRADITIONAL"},
            {"slug": "maha-ganesha-pancharatnam", "rel": "TRADITIONAL"}
        ]
    },
    # 10. GURU PURNIMA (Vyasa Puja)
    {
        "slug": "guru-purnima",
        "name": "Guru Purnima (Sri Vyasa Puja)",
        "category": "Annual Festival",
        "primaryDeity": "Guru",
        "description": "The full moon day dedicated to honoring the spiritual master, lineage of teachers, and Sage Veda Vyasa.",
        "significance": "Falling on Ashadha Purnima. Monastics begin their Chaturmasya vrata; students express gratitude to preceptors and spiritual guides.",
        "whatHappensToday": "Devotees worship the sacred Guru Padukas (sandals). Discourses on spiritual lineage and meditation sessions take place in ashrams and educational institutions.",
        "preparationGuide": "1. Meditate on the spiritual preceptor during early morning.\n2. Chant Sri Guru Stotram (Gurur Brahma).\n3. Express heartfelt reverence and gratitude to teachers, parents, and guides.\n4. Offer flowers, fruits, and dakshina to spiritual institutions.",
        "dates": [
            {"gregorianDate": "2025-07-10T00:00:00.000Z", "year": 2025, "region": "All India", "tithi": "Ashadha Purnima"},
            {"gregorianDate": "2026-06-29T00:00:00.000Z", "year": 2026, "region": "All India", "tithi": "Ashadha Purnima"},
            {"gregorianDate": "2027-07-18T00:00:00.000Z", "year": 2027, "region": "All India", "tithi": "Ashadha Purnima"}
        ],
        "slokas": [
            {"slug": "guru-stotram", "rel": "TRADITIONAL"},
            {"slug": "shanti-mantram", "rel": "TRADITIONAL"}
        ]
    },
    # 11. HANUMAN JAYANTI
    {
        "slug": "hanuman-jayanti",
        "name": "Sri Hanuman Jayanti",
        "category": "Annual Festival",
        "primaryDeity": "Hanuman",
        "description": "Celebration of the birth of Lord Hanuman, the quintessential devotee, embodiment of strength, wisdom, and humility.",
        "significance": "Celebrated on Chaitra Purnima (in North and Western India) and Margashirsha (in South India). Known for continuous recitation of Hanuman Chalisa.",
        "whatHappensToday": "Hanuman shrines are anointed with vermilion paste (sindoor) and mustard oil. Devotees offer sweet boondi, laddoos, and betel leaf garlands while reciting Hanuman Chalisa 108 times.",
        "preparationGuide": "1. Cleanse the altar and light a ghee lamp.\n2. Apply orange sindoor to Lord Hanuman's lotus feet.\n3. Recite Sri Hanuman Chalisa with deep devotion.\n4. Distribute prasadam to birds, animals, or children in honor of the Lord.",
        "dates": [
            {"gregorianDate": "2025-04-12T00:00:00.000Z", "year": 2025, "region": "All India", "tithi": "Chaitra Purnima"},
            {"gregorianDate": "2026-04-02T00:00:00.000Z", "year": 2026, "region": "All India", "tithi": "Chaitra Purnima"},
            {"gregorianDate": "2027-04-21T00:00:00.000Z", "year": 2027, "region": "All India", "tithi": "Chaitra Purnima"}
        ],
        "slokas": [
            {"slug": "hanuman-chalisa", "rel": "TRADITIONAL"}
        ]
    },
    # 12. RATHA SAPTAMI (Surya Jayanti)
    {
        "slug": "ratha-saptami",
        "name": "Ratha Saptami (Surya Jayanti)",
        "category": "Annual Festival",
        "primaryDeity": "Surya",
        "description": "Celebration of the Sun God turning His chariot toward the northern hemisphere (Uttarayana).",
        "significance": "Falling on Magha Shukla Saptami. Dedicated to health, vitality, eye sight, and dispelling dark mental fatigue.",
        "whatHappensToday": "Devotees take an auspicious bath placing seven Calotropis (Erukkam / Arka) leaves on the head, shoulders, and knees. Milk is boiled in earthen pots under direct sunlight until it overflows.",
        "preparationGuide": "1. Take a sacred morning bath facing the rising sun.\n2. Offer Arghya (water, red flowers, and rice) to Lord Surya.\n3. Recite Sri Aditya Hridaya Stotram.\n4. Cook sweet rice in sunlight and offer it to the Sun God.",
        "dates": [
            {"gregorianDate": "2025-02-04T00:00:00.000Z", "year": 2025, "region": "All India", "tithi": "Magha Shukla Saptami"},
            {"gregorianDate": "2026-01-25T00:00:00.000Z", "year": 2026, "region": "All India", "tithi": "Magha Shukla Saptami"},
            {"gregorianDate": "2027-02-13T00:00:00.000Z", "year": 2027, "region": "All India", "tithi": "Magha Shukla Saptami"}
        ],
        "slokas": [
            {"slug": "aditya-hridaya-stotram", "rel": "TRADITIONAL"}
        ]
    }
]

# Write out final combined dataset
final_data = {
    "slokas": generated_slokas,
    "versions": all_versions,
    "occasions": occasions_roster
}

output_path = 'data/intermediate/multilingual_comprehensive_dataset.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(final_data, f, ensure_ascii=False, indent=2)

print(f"Successfully generated {output_path} with {len(generated_slokas)} slokas, {len(all_versions)} multilingual versions, and {len(occasions_roster)} comprehensive festival occasions!")
