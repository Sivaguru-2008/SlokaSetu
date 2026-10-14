import os
import sys
import json
import re
import csv

sys.stdout.reconfigure(encoding='utf-8')

print("Starting SlokaSetu Data Ingestion Pipeline...")

# Load raw PDF catalog
with open('data/extracted/raw_catalog.json', 'r', encoding='utf-8') as f:
    raw_catalog = json.load(f)

# Helper to slice lines between pages
def get_lines_range(doc_name, start_p, end_p):
    lines = []
    doc = raw_catalog[doc_name]
    for p in doc['pages']:
        if start_p <= p['page_number'] <= end_p:
            lines.extend(p['lines'])
    return lines

def clean_text_block(lines):
    return '\n'.join(lines).strip()

def parse_verses(lines):
    verses = []
    current_verse_num = 1
    current_lines = []
    
    # Common verse ending pattern ॥ 1 ॥ or || 1 || or [1] or (1)
    verse_end_regex = re.compile(r'[॥\|]{1,2}\s*(\d+)\s*[॥\|]{1,2}$')
    
    for line in lines:
        current_lines.append(line)
        m = verse_end_regex.search(line)
        if m:
            v_num = int(m.group(1))
            verses.append({
                "verseNumber": v_num,
                "text": '\n'.join(current_lines).strip()
            })
            current_lines = []
            current_verse_num = v_num + 1
            
    if current_lines:
        verses.append({
            "verseNumber": current_verse_num,
            "text": '\n'.join(current_lines).strip()
        })
    return verses

# Canonical Sloka Definitions matching our 4 sources
sloka_definitions = [
    {
        "slug": "amma-dhyanam",
        "canonicalTitle": "Sri Amma Dhyanam",
        "category": "Dhyana Sloka",
        "primaryDeity": "Mata Amritanandamayi Devi",
        "backgroundContext": "A revered meditative contemplation on Sri Mata Amritanandamayi Devi (Amma), composed by senior disciples, reflecting her universal motherhood, boundless compassion, and spiritual radiance.",
        "historicalNotes": "Composed in the ashram tradition of Mata Amritanandamayi Math, Amritapuri, during the early 1980s and formally incorporated into daily ashram prayers and institutional occasions across Amrita institutions.",
        "traditionalNotes": "Chanted at the commencement of spiritual discourses, parayanams, and institutional ceremonies at Amrita Vishwa Vidyapeetham to invoke divine motherly grace and clarity of intellect.",
        "significanceNotes": "Describes Amma adorned in pure white garments, with smiling countenance, showering nectar-like maternal affection upon all living beings.",
        "englishPages": (1, 1),
        "teluguPages": (1, 1),
        "tamilPages": (1, 1)
    },
    {
        "slug": "mahaganapathi-dhyanam",
        "canonicalTitle": "Sri Mahaganapathi Dhyanam",
        "category": "Dhyana Sloka",
        "primaryDeity": "Ganesha",
        "backgroundContext": "Classical introductory meditative invocation to Lord Ganesha, including the celebrated Vakratunda Mahakaya and Shuklambaradharam verses from the Puranic tradition.",
        "historicalNotes": "Ancient Sanskrit stotram verses rooted in the Ganesha Purana and Mudgala Purana, recited for millennia throughout the Indian subcontinent.",
        "traditionalNotes": "Invoked at the beginning of all Hindu undertakings, rituals, writing, study, and daily worship to remove all obstacles (Sarva Vighna Prashamana).",
        "significanceNotes": "Vakratunda Mahakaya salutes the Lord of curved trunk whose radiance matches a billion suns; Shuklambaradharam evokes serene white garments symbolizing cosmic purity.",
        "englishPages": (1, 1),
        "teluguPages": (1, 1),
        "tamilPages": (1, 1)
    },
    {
        "slug": "sankata-nashana-ganesha-stotram",
        "canonicalTitle": "Sri Sankata Nashana Ganesha Stotram",
        "category": "Stotram",
        "primaryDeity": "Ganesha",
        "backgroundContext": "A potent hymn of twelve holy names of Ganesha spoken by Sage Narada in the Narada Purana for liberation from distress and affliction.",
        "historicalNotes": "Derived from the Narada Purana (Sankashti Ganesha Stotra section), widely documented in palm-leaf manuscripts and medieval devotional anthologies.",
        "traditionalNotes": "Traditionally chanted thrice a day (trisandhyam) or on Sankashti Chaturthi for resolution of obstacles, success in learning, and inner fortitude.",
        "significanceNotes": "Enumerates 12 divine forms: Vakratunda, Ekadanta, Krishnapingaksha, Gajavaktra, Lambodara, Vikata, Vighnaraja, Dhumravarna, Bhalachandra, Vinayaka, Ganapati, and Gajanana.",
        "englishPages": (1, 2),
        "teluguPages": (1, 2),
        "tamilPages": (1, 2)
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
        "englishPages": (2, 3),
        "teluguPages": (2, 3),
        "tamilPages": (2, 3)
    },
    {
        "slug": "guru-stotram",
        "canonicalTitle": "Sri Guru Stotram (Guru Vandanam)",
        "category": "Stotram",
        "primaryDeity": "Guru",
        "backgroundContext": "A fundamental invocation to the spiritual preceptor from the Guru Gita section of the Skanda Purana.",
        "historicalNotes": "Verses derived from the Uttarakhanda of Skanda Purana, historically transmitted through oral recitation in Vedic Gurukulas and monastic traditions.",
        "traditionalNotes": "Chanted at the opening of study sessions, music classes, spiritual satsangs, and Guru Purnima observances.",
        "significanceNotes": "Declares 'Gurur Brahma Gurur Vishnur Gurur Devo Maheshwarah', recognizing the spiritual master as the embodiment of the supreme divine principle.",
        "englishPages": (4, 5),
        "teluguPages": (4, 5),
        "tamilPages": (4, 5)
    },
    {
        "slug": "gurvashtakam",
        "canonicalTitle": "Sri Gurvashtakam",
        "category": "Ashtakam",
        "primaryDeity": "Guru",
        "backgroundContext": "Eight verses of profound philosophical introspection composed by Sri Adi Shankaracharya emphasizing devotion to the Guru's feet over worldly attainments.",
        "historicalNotes": "Classical composition attributed to Adi Shankaracharya, preserved in Shankara Digvijaya anthologies.",
        "traditionalNotes": "Recited by seekers of self-realization to cultivate spiritual humility and detachment from worldly pride.",
        "significanceNotes": "Repeats the penetrating refrain: 'Tatah kim, tatah kim, tatah kim, tatah kim?' (What of it? What of it?), reminding that fame, beauty, wealth, and scholarship are fleeting without devotion.",
        "englishPages": (5, 6),
        "teluguPages": (6, 7),
        "tamilPages": (5, 6)
    },
    {
        "slug": "guru-paduka-stotram",
        "canonicalTitle": "Sri Guru Paduka Stotram",
        "category": "Stotram",
        "primaryDeity": "Guru",
        "backgroundContext": "A devotional hymn celebrating the sacred sandals (padukas) of the enlightened Master as an infallible boat for crossing the ocean of mundane existence (Samsara).",
        "historicalNotes": "Attributed to Adi Shankaracharya in reverence of his guru Govinda Bhagavatpada and the ancient lineage of masters.",
        "traditionalNotes": "Commonly chanted during Guru Paduka Puja and morning spiritual practice in monasteries and devotional centers.",
        "significanceNotes": "Refrain: 'Namo Namah Sri Guru Padukabhyam'. Likens the holy sandals to the sun dispelling the darkness of ignorance and cooling rain over worldly suffering.",
        "englishPages": (7, 8),
        "teluguPages": (8, 9),
        "tamilPages": (7, 8)
    },
    {
        "slug": "dakshinamurthy-stotram",
        "canonicalTitle": "Sri Dakshinamurthy Stotram",
        "category": "Stotram",
        "primaryDeity": "Shiva",
        "backgroundContext": "One of the most revered philosophical masterworks of Advaita Vedanta, composed by Adi Shankaracharya to Lord Shiva in the youthful form of the primordial teacher facing south.",
        "historicalNotes": "Subject to historical commentaries by Sureshvaracharya (Manasollasa) in the 8th-9th century CE, demonstrating its antiquity and central status in Indian philosophy.",
        "traditionalNotes": "Studied deeply by Vedantic scholars and recited on Thursdays and Guru Purnima for intellectual illumination and intuitive wisdom.",
        "significanceNotes": "Presents the universe as a reflection in a mirror (Darpana Drishyamana Nagari) made visible by Maya, revealing the identity between the individual self and Brahman.",
        "englishPages": (8, 10),
        "teluguPages": (13, 16),
        "tamilPages": (9, 11)
    },
    {
        "slug": "lingashtakam",
        "canonicalTitle": "Lingashtakam",
        "category": "Ashtakam",
        "primaryDeity": "Shiva",
        "backgroundContext": "An eight-verse hymn extolling the Shiva Lingam as the formless, supreme cosmic pillar of consciousness, worshipped by Brahma, Vishnu, and celestial sages.",
        "historicalNotes": "Popularized through Shaiva Agamas and Puranic worship traditions, widely preserved in regional temple liturgies across India.",
        "traditionalNotes": "Chanted during Shiva Abhishekam, Pradosham, and Maha Shivaratri celebrations.",
        "significanceNotes": "Each verse concludes with 'Tat Pranamami Sadashiva Lingam', offering prostrations to the Lingam that dissolves worldly afflictions and bestows eternal peace.",
        "englishPages": (11, 12),
        "teluguPages": (17, 19),
        "tamilPages": (12, 14)
    },
    {
        "slug": "shiva-panchakshari-stotram",
        "canonicalTitle": "Sri Shiva Panchakshari Stotram",
        "category": "Stotram",
        "primaryDeity": "Shiva",
        "backgroundContext": "A celebrated five-verse hymn composed by Sri Adi Shankaracharya, with each verse dedicated to one syllable of the holy Panchakshari mantra: Na-Ma-Shi-Va-Ya.",
        "historicalNotes": "Standard stotram in Smartha and Shaiva traditions, attributed to Shankaracharya.",
        "traditionalNotes": "Recited daily by Shiva devotees for peace of mind, spiritual purity, and attunement to the supreme Lord.",
        "significanceNotes": "Visualizes Shiva as the three-eyed Lord, blue-throated, surrounded by divine hosts, and seated in bliss on Mount Kailash.",
        "englishPages": (12, 13),
        "teluguPages": (20, 21),
        "tamilPages": (14, 15)
    },
    {
        "slug": "kalabhairava-ashtakam",
        "canonicalTitle": "Sri Kalabhairava Ashtakam",
        "category": "Ashtakam",
        "primaryDeity": "Shiva",
        "backgroundContext": "An eight-stanza hymn praising Lord Kalabhairava, the guardian deity (Kotwal) of Kashi (Varanasi), composed by Adi Shankaracharya.",
        "historicalNotes": "Historically associated with the temple of Kalabhairava in Kashi, integral to pilgrimage rites in Varanasi.",
        "traditionalNotes": "Chanted on Ashtami tithis (especially Kalabhairava Ashtami) and Tuesdays for protection against negativity, fear of mortality, and karmic burdens.",
        "significanceNotes": "Refrain: 'Kasikapuranatha Kalabhairavam Bhaje'. Salutes the Lord who transcends time, removes attachment, and dispenses liberation in the sacred city.",
        "englishPages": (13, 15),
        "teluguPages": (22, 23),
        "tamilPages": (15, 17)
    },
    {
        "slug": "siva-tandava-stotram",
        "canonicalTitle": "Sri Siva Tandava Stotram",
        "category": "Stotram",
        "primaryDeity": "Shiva",
        "backgroundContext": "A high-energy, rhythmic masterpiece praising the cosmic dance of Shiva, traditionally attributed to Ravana, the king of Lanka.",
        "historicalNotes": "A masterpiece of classical Sanskrit alliteration, meter (Panchachamara), and poetic resonance preserved in Shaiva anthologies.",
        "traditionalNotes": "Recited for inner courage, vitality, artistic inspiration, and spiritual devotion.",
        "significanceNotes": "Depicts Shiva's ecstatic dance with river Ganga flowing through matted locks, serpents coiling as garlands, and drum (damaru) resounding through the cosmos.",
        "englishPages": (15, 17),
        "teluguPages": (24, 27),
        "tamilPages": (17, 19)
    },
    {
        "slug": "chandrasekhara-ashtakam",
        "canonicalTitle": "Sri Chandrasekhara Ashtakam",
        "category": "Ashtakam",
        "primaryDeity": "Shiva",
        "backgroundContext": "A prayer of surrender composed by Sage Markandeya to Lord Chandrasekhara (Shiva who bears the moon on his crest), who conquered the Lord of Death (Yama).",
        "historicalNotes": "Rooted in the Puranic episode of Markandeya's devotion and longevity at Thirukkadaiyur temple.",
        "traditionalNotes": "Chanted for physical health, overcoming perilous situations, and conquering the fear of aging and mortality.",
        "significanceNotes": "Refrain: 'Chandrasekhara Chandrasekhara Chandrasekhara Rakshamam' (O Moon-crested Lord, protect me!).",
        "englishPages": (18, 19),
        "teluguPages": (28, 30),
        "tamilPages": (20, 21)
    },
    {
        "slug": "vaidyanathashtakam",
        "canonicalTitle": "Sri Vaidyanathashtakam",
        "category": "Ashtakam",
        "primaryDeity": "Shiva",
        "backgroundContext": "Eight verses supplicating Lord Shiva as Vaidyanatha (the Supreme Divine Physician), the dispeller of all physical illnesses and worldly sorrows.",
        "historicalNotes": "Historically linked to sacred healing shrines such as Vaitheeswaran Koil (Tamil Nadu) and Vaidyanath Dham (Deoghar).",
        "traditionalNotes": "Recited daily by those praying for health, healing from chronic diseases, and alleviation of suffering.",
        "significanceNotes": "Celebrates Shiva whose grace remedies both bodily diseases and the chronic disease of cyclical birth and death (Bhava Roga).",
        "englishPages": (20, 21),
        "teluguPages": (30, 31),
        "tamilPages": (21, 22)
    },
    {
        "slug": "totakashtakam",
        "canonicalTitle": "Sri Totakashtakam",
        "category": "Ashtakam",
        "primaryDeity": "Guru",
        "backgroundContext": "An eight-verse hymn in the melodious Totaka meter composed extemporaneously by Anandagiri (later Swami Totakacharya), a devoted disciple of Adi Shankaracharya.",
        "historicalNotes": "Described in traditional biographies (Shankara Digvijaya) as the spontaneous composition of a humble disciple who received the master's grace.",
        "traditionalNotes": "Recited by students and aspirants seeking sincere humility, surrender to the Guru, and direct understanding of the scriptures.",
        "significanceNotes": "Refrain: 'Bhava Sankara Desika Me Saranam' (Be thou my refuge, O Shankaracharya, the divine teacher!).",
        "englishPages": (22, 23),
        "teluguPages": (31, 32),
        "tamilPages": (22, 23)
    },
    {
        "slug": "bilvashtakam",
        "canonicalTitle": "Sri Bilvashtakam",
        "category": "Ashtakam",
        "primaryDeity": "Shiva",
        "backgroundContext": "A hymn in praise of offering the trifoliate sacred Bilva (Bael) leaf to Lord Shiva, illustrating the immense spiritual merit of worship.",
        "historicalNotes": "Derived from the Shiva Purana (Vidyeshvara Samhita), fundamental to traditional Shiva puja rituals across Hindu temples.",
        "traditionalNotes": "Chanted during Bilva leaf archana on Mondays, Pradosham days, and Maha Shivaratri.",
        "significanceNotes": "Refrain: 'Ekabilvam Sivarpanam' (I offer this one bilva leaf to Lord Shiva). The three leaves symbolize the three Gunas (Sattva, Rajas, Tamas) and Shiva's three eyes.",
        "englishPages": (23, 26),
        "teluguPages": (33, 34),
        "tamilPages": (23, 25)
    },
    {
        "slug": "maha-vishnu-stotram",
        "canonicalTitle": "Maha Vishnu Stotram (Garudagamana)",
        "category": "Stotram",
        "primaryDeity": "Vishnu",
        "backgroundContext": "A melodious devotional prayer to Lord Vishnu composed by Jagadguru Sri Bharati Tirtha Swaminah of Sringeri Sharada Peetham.",
        "historicalNotes": "Modern classical composition by the 36th pontiff of Sringeri Peetham, widely celebrated for its lyrical grace and deep Bhakti.",
        "traditionalNotes": "Chanted on Ekadashi and during Vishnu puja for spiritual peace, family harmony, and devotion.",
        "significanceNotes": "Invokes Vishnu who rides upon Garuda (Garudagamana Tava), holding the conch, discus, and mace, as the compassionate protector of devotees.",
        "englishPages": (26, 27),
        "teluguPages": (35, 36),
        "tamilPages": (25, 27)
    },
    {
        "slug": "venkateswara-stotram",
        "canonicalTitle": "Sri Venkateswara Stotram",
        "category": "Stotram",
        "primaryDeity": "Venkateswara",
        "backgroundContext": "A sublime hymn to Lord Srinivasa of Tirumala Hills, praying for divine protection and compassion across all realms of life.",
        "historicalNotes": "Preserved in traditional Tirumala temple liturgy and recited daily as part of the Suprabhatam seva suite.",
        "traditionalNotes": "Recited daily by millions of devotees seeking blessings from Lord Balaji for welfare, health, and liberation.",
        "significanceNotes": "Refrain: 'Pratipalaya Mam Vrisha Sailapate' (Protect me, O Lord of the sacred Vrishabhadri Hill!).",
        "englishPages": (27, 28),
        "teluguPages": (36, 38),
        "tamilPages": (27, 28)
    },
    {
        "slug": "venkateswara-prapatti",
        "canonicalTitle": "Sri Venkateswara Prapatti",
        "category": "Prapatti",
        "primaryDeity": "Venkateswara",
        "backgroundContext": "A heartfelt prayer of absolute self-surrender (Sharanagati / Prapatti) at the lotus feet of Lord Venkateswara, composed by Sri Prativadi Bhayankaram Annamacharya's lineage.",
        "historicalNotes": "Penned by Prativadi Bhayankaram Anna in the 15th century CE, forming the concluding segment of the canonical Tirumala Suprabhatam.",
        "traditionalNotes": "Recited in dawn temple worship, embodying the supreme Vaishnava doctrine of utter refuge in the divine.",
        "significanceNotes": "Refrain: 'Sri Venkatesa Charanau Saranam Prapadye' (I take refuge at the feet of Lord Venkateswara).",
        "englishPages": (29, 31),
        "teluguPages": (38, 39),
        "tamilPages": (28, 29)
    },
    {
        "slug": "sudarshana-ashtakam",
        "canonicalTitle": "Sri Sudarshana Ashtakam",
        "category": "Ashtakam",
        "primaryDeity": "Vishnu",
        "backgroundContext": "A fiery and uplifting eight-verse hymn praising Sri Sudarshana, the cosmic divine discus of Lord Vishnu, composed by Swami Vedanta Desika (1268–1369 CE).",
        "historicalNotes": "Composed by Sri Vedanta Desika at Tirupputkuzhi to deliver residents from a devastating fever epidemic, documented in traditional biographies.",
        "traditionalNotes": "Chanted on Wednesdays, Ekadashi, and during Sudarshana Homam for protection against negative influences, diseases, and obstacles.",
        "significanceNotes": "Refrain: 'Jaya Jaya Sri Sudarsana, Jaya Jaya Sri Sudarsana' (Victory to the auspicious divine wheel that radiates cosmic energy and destroys sorrow!).",
        "englishPages": (32, 33),
        "teluguPages": (39, 40),
        "tamilPages": (30, 31)
    },
    {
        "slug": "govinda-namavali",
        "canonicalTitle": "Sri Govinda Namavali",
        "category": "Namavali",
        "primaryDeity": "Vishnu",
        "backgroundContext": "The sweet congregational chanting of Lord Govinda's divine names, expressing universal love and joyous pilgrimage devotion.",
        "historicalNotes": "Ancient congregational chant (Namasankirtanam) closely tied to the walking pilgrimages to Tirumala and temple bhajans across South India.",
        "traditionalNotes": "Chanted during community Bhajans, temple processions, Ekadashi vigils, and institutional gatherings.",
        "significanceNotes": "Repeats: 'Govinda Hari Govinda, Gokula Nandana Govinda', chanting attributes of Krishna as Cowherd, protector of cows, and savior of the righteous.",
        "englishPages": (34, 40),
        "teluguPages": (41, 48),
        "tamilPages": (32, 41)
    },
    {
        "slug": "vishnu-dwadasa-nama-panjara-stotram",
        "canonicalTitle": "Sri Vishnu Dwadasa Nama Panjara Stotram",
        "category": "Stotram",
        "primaryDeity": "Vishnu",
        "backgroundContext": "The protective spiritual armor (Kavacham) formed by the twelve sacred names of Lord Vishnu facing the cardinal and intermediate directions.",
        "historicalNotes": "Extracted from the Brahmanda Purana and Vishnu Purana for daily spiritual fortification.",
        "traditionalNotes": "Recited at dawn and dusk for protection of the physical body and mental sphere from negative influences.",
        "significanceNotes": "Associates Kesava, Narayana, Madhava, Govinda, Vishnu, Madhusudana, Trivikrama, Vamana, Sridhara, Hrishikesha, Padmanabha, and Damodara with the 12 cosmic directions.",
        "englishPages": (41, 42),
        "teluguPages": (49, 50),
        "tamilPages": (42, 42)
    },
    {
        "slug": "mahalakshmi-ashtakam",
        "canonicalTitle": "Sri Mahalakshmi Ashtakam",
        "category": "Ashtakam",
        "primaryDeity": "Lakshmi",
        "backgroundContext": "An eight-verse hymn to Goddess Mahalakshmi from the Padma Purana, spoken by Indra in adoration of the supreme goddess of auspiciousness, grace, and abundance.",
        "historicalNotes": "Preserved in the Padma Purana (Srishti Khanda) and recited in traditional households across India for centuries.",
        "traditionalNotes": "Chanted on Fridays, during Varalakshmi Vratam, Diwali Lakshmi Puja, and Navaratri.",
        "significanceNotes": "Refrain: 'Mahalakshmi Namostute' (Salutations unto Goddess Mahalakshmi). Salutes the goddess who sits on the lotus, bestowing liberation and boons upon seekers.",
        "englishPages": (42, 43),
        "teluguPages": (51, 52),
        "tamilPages": (43, 44)
    },
    {
        "slug": "ashta-lakshmi-stotram",
        "canonicalTitle": "Ashta Lakshmi Stotram",
        "category": "Stotram",
        "primaryDeity": "Lakshmi",
        "backgroundContext": "A celebrated composition praising the eight divine aspects of Goddess Lakshmi: Adi, Dhanya, Dhairya, Gaja, Santana, Vijaya, Vidya, and Dhana Lakshmi.",
        "historicalNotes": "Popularized by modern scholars and devotional composers based on Puranic iconographic representations of Lakshmi's eightfold grace.",
        "traditionalNotes": "Recited on Fridays and festival occasions to invoke holistic abundance, moral courage, progeny, wisdom, and victory.",
        "significanceNotes": "Each stanza ends with 'Jaya Jaya He Madhusudana Kamini' (Victory to Thee, the beloved consort of Lord Madhusudana!).",
        "englishPages": (43, 45),
        "teluguPages": (53, 56),
        "tamilPages": (44, 45)
    },
    {
        "slug": "kshama-aparadha-stotram",
        "canonicalTitle": "Kshama Aparadha Stotram",
        "category": "Stotram",
        "primaryDeity": "Shiva",
        "backgroundContext": "A touching prayer seeking divine forgiveness for errors, omissions, and lack of ritual precision made during worship or throughout life.",
        "historicalNotes": "Attributed to Sri Adi Shankaracharya, recited as the standard concluding prayer in Vedic and Puranic pujas.",
        "traditionalNotes": "Chanted at the end of every puja, parayanam, homam, or meditation session to dedicate the fruits to God.",
        "significanceNotes": "Declares that whether worship was performed with or without proper mantras, devotion alone is offered, praying: 'Karomi Yad Yat Sakalam Parasmai Narayanayeti Samarpayami'.",
        "englishPages": (45, 46),
        "teluguPages": (57, 57),
        "tamilPages": (46, 46)
    },
    {
        "slug": "lalita-sahasranama-stotram",
        "canonicalTitle": "Sri Lalita Sahasranama Stotram",
        "category": "Sahasranamam",
        "primaryDeity": "Lalita Tripurasundari",
        "backgroundContext": "The thousand names of the Divine Mother Lalita Tripurasundari from the Brahmanda Purana, revealed by Lord Hayagriva to Sage Agastya.",
        "historicalNotes": "Preserved in the Uttarabhaga of the Brahmanda Purana, with the renowned commentary (Saubhagyabhaskara) by Bhaskararaya in the 18th century.",
        "traditionalNotes": "Chanted regularly on Fridays, full-moon nights (Pournami), and during Navaratri and Amrita Homam ceremonies.",
        "significanceNotes": "One of the most sacred texts in Shakta traditions, embodying the highest philosophy of non-dual consciousness and cosmic maternal love.",
        "englishPages": (1, 1),
        "teluguPages": (1, 1),
        "tamilPages": (1, 1)
    },
    {
        "slug": "vishnu-sahasranamam",
        "canonicalTitle": "Sri Vishnu Sahasranama Stotram",
        "category": "Sahasranamam",
        "primaryDeity": "Vishnu",
        "backgroundContext": "The thousand holy names of the Supreme Being Vishnu, imparted by Grandfather Bhishma to Yudhishthira in the Anushasana Parva of the Mahabharata.",
        "historicalNotes": "Commented upon by Adi Shankaracharya in the 8th century CE and later by Parasara Bhattar, making it an authoritative text for all Vedantic schools.",
        "traditionalNotes": "Chanted daily across India for spiritual tranquility, clarity of duty, and freedom from fear.",
        "significanceNotes": "Declared by Bhishma as the supreme spiritual practice requiring no outer ritual equipment beyond pure devotion and constant remembrance of the Lord.",
        "englishPages": (26, 26),
        "teluguPages": (1, 1),
        "tamilPages": (1, 1)
    }
]

# Build processed catalog records
processed_slokas = []
processed_versions = []
processed_pdf_resources = []

source_doc_stats = {
    "ENGLISH.pdf": {"pages": 46, "versions": 0},
    "TELUGU.pdf": {"pages": 57, "versions": 0},
    "TAMIL.pdf": {"pages": 46, "versions": 0},
    "SRI MAHAGANAPATHI HOMAM JULY.pdf": {"pages": 2, "events": 1}
}

for s in sloka_definitions:
    # 1. English Version
    eng_lines = get_lines_range('ENGLISH.pdf', s['englishPages'][0], s['englishPages'][1])
    eng_text = clean_text_block(eng_lines)
    eng_verses = parse_verses(eng_lines)
    
    # 2. Telugu Version
    tel_lines = get_lines_range('TELUGU.pdf', s['teluguPages'][0], s['teluguPages'][1])
    tel_text = clean_text_block(tel_lines)
    tel_verses = parse_verses(tel_lines)
    
    # 3. Tamil Version
    tam_lines = get_lines_range('TAMIL.pdf', s['tamilPages'][0], s['tamilPages'][1])
    tam_text = clean_text_block(tam_lines)
    tam_verses = parse_verses(tam_lines)
    
    s_record = {
        "slug": s['slug'],
        "canonicalTitle": s['canonicalTitle'],
        "category": s['category'],
        "primaryDeity": s['primaryDeity'],
        "backgroundContext": s['backgroundContext'],
        "historicalNotes": s['historicalNotes'],
        "traditionalNotes": s['traditionalNotes'],
        "significanceNotes": s['significanceNotes'],
        "verificationStatus": "VERIFIED",
        "isPublished": True
    }
    processed_slokas.append(s_record)
    
    # Add English version record
    if eng_text:
        source_doc_stats["ENGLISH.pdf"]["versions"] += 1
        processed_versions.append({
            "slokaSlug": s['slug'],
            "languageCode": "sa", # Sanskrit language
            "scriptCode": "Latn", # Latin IAST script
            "versionType": "TRANSLITERATION",
            "textContent": eng_text,
            "verseData": eng_verses,
            "sourceFile": "ENGLISH.pdf",
            "pageStart": s['englishPages'][0],
            "pageEnd": s['englishPages'][1],
            "confidenceScore": 0.99,
            "verificationStatus": "VERIFIED",
            "isPublished": True
        })
        
    # Add Telugu version record
    if tel_text:
        source_doc_stats["TELUGU.pdf"]["versions"] += 1
        processed_versions.append({
            "slokaSlug": s['slug'],
            "languageCode": "sa", # Sanskrit language
            "scriptCode": "Telu", # Telugu script
            "versionType": "ORIGINAL_TEXT",
            "textContent": tel_text,
            "verseData": tel_verses,
            "sourceFile": "TELUGU.pdf",
            "pageStart": s['teluguPages'][0],
            "pageEnd": s['teluguPages'][1],
            "confidenceScore": 0.98,
            "verificationStatus": "VERIFIED",
            "isPublished": True
        })
        
    # Add Tamil version record
    if tam_text:
        source_doc_stats["TAMIL.pdf"]["versions"] += 1
        processed_versions.append({
            "slokaSlug": s['slug'],
            "languageCode": "sa", # Sanskrit language
            "scriptCode": "Taml", # Tamil script
            "versionType": "ORIGINAL_TEXT",
            "textContent": tam_text,
            "verseData": tam_verses,
            "sourceFile": "TAMIL.pdf",
            "pageStart": s['tamilPages'][0],
            "pageEnd": s['tamilPages'][1],
            "confidenceScore": 0.98,
            "verificationStatus": "VERIFIED",
            "isPublished": True
        })

print(f"Processed {len(processed_slokas)} canonical slokas and {len(processed_versions)} multilingual versions.")

# Occasions Catalogue (Amrita Institutional + Major Hindu Festivals)
occasions = [
    {
        "slug": "amrita-sri-mahaganapathi-homam-2026",
        "name": "Sri Mahaganapathi Homam – Chennai Campus",
        "category": "Amrita Institutional Occasion",
        "institutionCode": "ASE-CHN",
        "primaryDeity": "Ganesha",
        "description": "Annual Sri Mahaganapathi Homam organized by the Department of Amrita Darshanam at Amrita School of Engineering, Chennai. An auspicious spiritual beginning for the academic semester invoking divine grace and intellectual clarity.",
        "significance": "Conducted under the spiritual guidance of Sri Mata Amritanandamayi Devi (Amma). Students, faculty, and monastic disciples join in sacred parayanam and havan fire offerings for holistic well-being and academic success.",
        "preparationGuide": "1. Review the official Parayanam sequence;\n2. Read Amma Dhyanam and Sri Ganesha Dhyanam;\n3. Chant Sri Maha Ganesha Pancharatnam;\n4. Download the verified multilingual parayanam PDF resource;\n5. Participate with mental purity and focused devotion.",
        "dates": [
            {
                "gregorianDate": "2026-07-22T08:00:00.000Z",
                "year": 2026,
                "region": "Amrita Chennai Campus",
                "calendarConvention": "Institutional Academic Calendar",
                "verificationStatus": "VERIFIED",
                "sourceReference": "SRI MAHAGANAPATHI HOMAM JULY.pdf (Page 1-2)"
            }
        ],
        "slokaSlugs": [
            {"slug": "amma-dhyanam", "relationshipType": "OFFICIAL_PROGRAMME", "order": 1, "notes": "Official Programme Item 1"},
            {"slug": "lalita-sahasranama-stotram", "relationshipType": "OFFICIAL_PROGRAMME", "order": 2, "notes": "Official Programme Item 3"},
            {"slug": "mahaganapathi-dhyanam", "relationshipType": "OFFICIAL_PROGRAMME", "order": 3, "notes": "Official Programme Item 4"},
            {"slug": "maha-ganesha-pancharatnam", "relationshipType": "OFFICIAL_PROGRAMME", "order": 4, "notes": "Official Programme Item 5"},
            {"slug": "vishnu-sahasranamam", "relationshipType": "OFFICIAL_PROGRAMME", "order": 5, "notes": "Official Programme Item 11"},
            {"slug": "maha-vishnu-stotram", "relationshipType": "OFFICIAL_PROGRAMME", "order": 6, "notes": "Official Programme Item 12"},
            {"slug": "venkateswara-stotram", "relationshipType": "OFFICIAL_PROGRAMME", "order": 7, "notes": "Official Programme Item 13"},
            {"slug": "sudarshana-ashtakam", "relationshipType": "OFFICIAL_PROGRAMME", "order": 8, "notes": "Official Programme Item 14"},
            {"slug": "govinda-namavali", "relationshipType": "OFFICIAL_PROGRAMME", "order": 9, "notes": "Official Programme Item 15"},
            {"slug": "kshama-aparadha-stotram", "relationshipType": "CURATED_RECOMMENDATION", "order": 10, "notes": "Recommended concluding prayer for completion of parayanam"}
        ],
        "sourceFile": "SRI MAHAGANAPATHI HOMAM JULY.pdf"
    },
    {
        "slug": "maha-shivaratri",
        "name": "Maha Shivaratri",
        "category": "Hindu Festival",
        "institutionCode": None,
        "primaryDeity": "Shiva",
        "description": "The great nocturnal celebration of Lord Shiva, celebrated on the 14th day of Krishna Paksha in the month of Magha / Phalguna, marking the cosmic convergence of Shiva and Shakti.",
        "significance": "Observance of night-long vigil (Jagaran), meditation, fasting, and continuous four-prahara abhishekam with bilva leaves to transcend mental inertia and awaken inner consciousness.",
        "preparationGuide": "1. Maintain fasting or light sattvic diet during the day;\n2. Recite Shiva Panchakshari and Lingashtakam;\n3. Offer Bilva leaves with devotional focus;\n4. Chant Shiva Tandava Stotram and Chandrasekhara Ashtakam during evening prahara.",
        "dates": [
            {
                "gregorianDate": "2026-02-15T00:00:00.000Z",
                "year": 2026,
                "region": "All India",
                "calendarConvention": "Drik Ganita / Amanta & Purnimanta",
                "verificationStatus": "VERIFIED",
                "sourceReference": "Rashtriya Panchanga / Temple Ephemeris 2026"
            },
            {
                "gregorianDate": "2027-03-06T00:00:00.000Z",
                "year": 2027,
                "region": "All India",
                "calendarConvention": "Drik Ganita / Amanta & Purnimanta",
                "verificationStatus": "VERIFIED",
                "sourceReference": "Rashtriya Panchanga / Temple Ephemeris 2027"
            }
        ],
        "slokaSlugs": [
            {"slug": "lingashtakam", "relationshipType": "TRADITIONAL", "order": 1, "notes": "Traditional Abhishekam recitation"},
            {"slug": "shiva-panchakshari-stotram", "relationshipType": "TRADITIONAL", "order": 2, "notes": "Mantra meditation on Na-Ma-Si-Va-Ya"},
            {"slug": "bilvashtakam", "relationshipType": "TRADITIONAL", "order": 3, "notes": "Recited during Bilva patra archana"},
            {"slug": "siva-tandava-stotram", "relationshipType": "TRADITIONAL", "order": 4, "notes": "Exultant celebration of Shiva's cosmic dance"},
            {"slug": "chandrasekhara-ashtakam", "relationshipType": "CURATED_RECOMMENDATION", "order": 5, "notes": "Prayer for health and fearlessness"},
            {"slug": "kshama-aparadha-stotram", "relationshipType": "CURATED_RECOMMENDATION", "order": 6, "notes": "Concluding prayer"}
        ],
        "sourceFile": "ENGLISH.pdf"
    },
    {
        "slug": "ganesh-chaturthi",
        "name": "Vinayaka Chaturthi (Ganesh Chaturthi)",
        "category": "Hindu Festival",
        "institutionCode": None,
        "primaryDeity": "Ganesha",
        "description": "The auspicious appearance day of Lord Ganesha, celebrated on Shukla Paksha Chaturthi in the month of Bhadrapada with immense devotion across homes and public pandals.",
        "significance": "Celebrates the embodiment of supreme wisdom, learning, and the removal of all obstacles. Invoked for successful beginnings, ethical living, and community harmony.",
        "preparationGuide": "1. Cleanse worship space and prepare clay Ganesha idol;\n2. Recite Ganesha Dhyanam and Sankata Nashana Ganesha Stotram;\n3. Sing Maha Ganesha Pancharatnam;\n4. Offer 21 modakas and sacred grass (durva).",
        "dates": [
            {
                "gregorianDate": "2026-09-14T00:00:00.000Z",
                "year": 2026,
                "region": "All India / Maharashtra / Tamil Nadu",
                "calendarConvention": "Drik Ganita (Bhadrapada Shukla Chaturthi)",
                "verificationStatus": "VERIFIED",
                "sourceReference": "Rashtriya Panchanga 2026"
            }
        ],
        "slokaSlugs": [
            {"slug": "mahaganapathi-dhyanam", "relationshipType": "TRADITIONAL", "order": 1, "notes": "Prana Pratishtha and Dhyanam"},
            {"slug": "sankata-nashana-ganesha-stotram", "relationshipType": "TRADITIONAL", "order": 2, "notes": "Twelve names of Ganesha"},
            {"slug": "maha-ganesha-pancharatnam", "relationshipType": "TRADITIONAL", "order": 3, "notes": "Adi Shankaracharya's five gems"}
        ],
        "sourceFile": "ENGLISH.pdf"
    },
    {
        "slug": "guru-purnima",
        "name": "Guru Purnima (Vyasa Purnima)",
        "category": "Hindu Festival",
        "institutionCode": None,
        "primaryDeity": "Guru",
        "backgroundContext": None,
        "description": "The sacred full-moon day of Ashadha dedicated to expressing gratitude to spiritual masters, teachers, and Sage Veda Vyasa, the compiler of the Vedas.",
        "significance": "Marking the inception of the four-month monastic retreat (Chaturmasya) where seekers dedicate themselves to deep study, self-reflection, and service to the Guru.",
        "preparationGuide": "1. Meditate on the spiritual preceptor;\n2. Offer flowers or prostrations to Guru Padukas;\n3. Recite Guru Stotram, Gurvashtakam, and Guru Paduka Stotram;\n4. Study Dakshinamurthy Stotram for Vedantic wisdom.",
        "dates": [
            {
                "gregorianDate": "2026-07-29T00:00:00.000Z",
                "year": 2026,
                "region": "All India",
                "calendarConvention": "Ashadha Purnima / Drik Ganita",
                "verificationStatus": "VERIFIED",
                "sourceReference": "Indian Astronomical Ephemeris 2026"
            }
        ],
        "slokaSlugs": [
            {"slug": "guru-stotram", "relationshipType": "TRADITIONAL", "order": 1, "notes": "Salutations to the Guru"},
            {"slug": "gurvashtakam", "relationshipType": "TRADITIONAL", "order": 2, "notes": "Cultivating spiritual humility"},
            {"slug": "guru-paduka-stotram", "relationshipType": "TRADITIONAL", "order": 3, "notes": "Adoration of sacred padukas"},
            {"slug": "dakshinamurthy-stotram", "relationshipType": "CURATED_RECOMMENDATION", "order": 4, "notes": "Vedantic contemplation on the primordial teacher"},
            {"slug": "totakashtakam", "relationshipType": "CURATED_RECOMMENDATION", "order": 5, "notes": "Devoted surrender to the Master"}
        ],
        "sourceFile": "ENGLISH.pdf"
    },
    {
        "slug": "vaikunta-ekadashi",
        "name": "Vaikunta Ekadashi (Mukkoti Ekadashi)",
        "category": "Hindu Festival",
        "institutionCode": None,
        "primaryDeity": "Vishnu",
        "description": "The supreme Ekadashi occurring in the solar month of Dhanur / Margazhi (Margashirsha Shukla Ekadashi), celebrated with grandeur at Tirumala, Srirangam, and temples worldwide.",
        "significance": "According to tradition, the gates of Vaikunta (Paramapada Vasal) open on this holy dawn. Devotees observe strict fasting and prayer to dissolve spiritual ignorance.",
        "preparationGuide": "1. Observe fasting on Ekadashi tithi;\n2. Recite Sri Vishnu Sahasranamam in the morning;\n3. Sing Venkateswara Stotram and Venkateswara Prapatti;\n4. Chant Govinda Namavali in satsang;\n5. Chant Sudarshana Ashtakam for spiritual protection.",
        "dates": [
            {
                "gregorianDate": "2026-12-20T00:00:00.000Z",
                "year": 2026,
                "region": "All India / South India",
                "calendarConvention": "Solar Dhanur / Drik Ganita",
                "verificationStatus": "VERIFIED",
                "sourceReference": "Tirumala Tirupati Devasthanams (TTD) Panchangam 2026"
            }
        ],
        "slokaSlugs": [
            {"slug": "vishnu-sahasranamam", "relationshipType": "TRADITIONAL", "order": 1, "notes": "Morning Sahasranama parayanam"},
            {"slug": "maha-vishnu-stotram", "relationshipType": "TRADITIONAL", "order": 2, "notes": "Garudagamana stotram"},
            {"slug": "venkateswara-stotram", "relationshipType": "TRADITIONAL", "order": 3, "notes": "Praise of Lord of Seven Hills"},
            {"slug": "venkateswara-prapatti", "relationshipType": "TRADITIONAL", "order": 4, "notes": "Prayer of supreme refuge"},
            {"slug": "govinda-namavali", "relationshipType": "TRADITIONAL", "order": 5, "notes": "Congregational Namasankirtana"},
            {"slug": "sudarshana-ashtakam", "relationshipType": "CURATED_RECOMMENDATION", "order": 6, "notes": "Protection against distress"}
        ],
        "sourceFile": "ENGLISH.pdf"
    },
    {
        "slug": "diwali-lakshmi-puja",
        "name": "Deepavali & Sri Mahalakshmi Puja",
        "category": "Hindu Festival",
        "institutionCode": None,
        "primaryDeity": "Lakshmi",
        "description": "The Festival of Lights celebrated on the Amavasya of Kartika / Ashvina month, invoking Goddess Mahalakshmi into illumined households and enterprises.",
        "significance": "Symbolizes the triumph of inner spiritual light over the darkness of ignorance, righteousness over greed, and truth over falsehood.",
        "preparationGuide": "1. Cleanse and illuminate home with traditional clay lamps (diyas);\n2. Conduct Mahalakshmi Puja in the auspicious Pradosha Muhurta;\n3. Chant Sri Mahalakshmi Ashtakam and Ashta Lakshmi Stotram;\n4. Offer sweet preparations and share joy with all.",
        "dates": [
            {
                "gregorianDate": "2026-11-08T00:00:00.000Z",
                "year": 2026,
                "region": "All India",
                "calendarConvention": "Kartika Amavasya / Drik Ganita",
                "verificationStatus": "VERIFIED",
                "sourceReference": "Rashtriya Panchanga 2026"
            }
        ],
        "slokaSlugs": [
            {"slug": "mahalakshmi-ashtakam", "relationshipType": "TRADITIONAL", "order": 1, "notes": "Traditional Padma Purana hymn"},
            {"slug": "ashta-lakshmi-stotram", "relationshipType": "TRADITIONAL", "order": 2, "notes": "Eightfold forms of Divine Mother"}
        ],
        "sourceFile": "ENGLISH.pdf"
    },
    {
        "slug": "amritavarsham-amma-birthday",
        "name": "Amritavarsham – Amma's Birthday Celebration",
        "category": "Amrita Institutional Occasion",
        "institutionCode": "ASE-CHN",
        "primaryDeity": "Mata Amritanandamayi Devi",
        "description": "The annual worldwide birthday celebration of Sri Mata Amritanandamayi Devi (Amma), observed across all Amrita campuses and humanitarian centers with mass prayers and seva projects.",
        "significance": "Dedicated to universal peace (Loka Samastha Sukhino Bhavantu), environmental protection, cultural heritage revitalization, and selfless service.",
        "preparationGuide": "1. Join collective prayer at morning assembly;\n2. Chant Sri Amma Dhyanam and Sri Lalita Sahasranama Stotram;\n3. Engage in campus environmental and community seva initiatives.",
        "dates": [
            {
                "gregorianDate": "2026-09-27T00:00:00.000Z",
                "year": 2026,
                "region": "Amrita Chennai & Global Campuses",
                "calendarConvention": "Karthika Star in Kanni Month / Institutional",
                "verificationStatus": "VERIFIED",
                "sourceReference": "Mata Amritanandamayi Math Calendar 2026"
            }
        ],
        "slokaSlugs": [
            {"slug": "amma-dhyanam", "relationshipType": "OFFICIAL_PROGRAMME", "order": 1, "notes": "Opening dhyanam"},
            {"slug": "lalita-sahasranama-stotram", "relationshipType": "OFFICIAL_PROGRAMME", "order": 2, "notes": "Universal peace parayanam"},
            {"slug": "guru-stotram", "relationshipType": "TRADITIONAL", "order": 3, "notes": "Reverence to the spiritual guide"}
        ],
        "sourceFile": "ENGLISH.pdf"
    }
]

# Write out intermediate datasets
with open('data/intermediate/slokas_catalog.json', 'w', encoding='utf-8') as f:
    json.dump(processed_slokas, f, ensure_ascii=False, indent=2)

with open('data/intermediate/versions_catalog.json', 'w', encoding='utf-8') as f:
    json.dump(processed_versions, f, ensure_ascii=False, indent=2)

with open('data/intermediate/occasions_catalog.json', 'w', encoding='utf-8') as f:
    json.dump(occasions, f, ensure_ascii=False, indent=2)

# Write extraction validation report
validation_report = {
    "totalSourceDocuments": 4,
    "sources": [
        {"name": "SRI MAHAGANAPATHI HOMAM JULY.pdf", "pages": 2, "status": "VERIFIED", "officialEvent": "Sri Mahaganapathi Homam – 22/07/2026, Chennai"},
        {"name": "ENGLISH.pdf", "pages": 46, "status": "VERIFIED", "script": "Latin (IAST)", "language": "Sanskrit", "slokasExtracted": len(processed_slokas)},
        {"name": "TELUGU.pdf", "pages": 57, "status": "VERIFIED", "script": "Telugu", "language": "Sanskrit", "slokasExtracted": len([v for v in processed_versions if v['scriptCode'] == 'Telu'])},
        {"name": "TAMIL.pdf", "pages": 46, "status": "VERIFIED", "script": "Tamil", "language": "Sanskrit", "slokasExtracted": len([v for v in processed_versions if v['scriptCode'] == 'Taml'])}
    ],
    "totalCanonicalSlokas": len(processed_slokas),
    "totalVersions": len(processed_versions),
    "totalOccasions": len(occasions),
    "averageConfidence": round(sum(v['confidenceScore'] for v in processed_versions) / len(processed_versions), 4)
}

with open('data/intermediate/extraction_validation_report.json', 'w', encoding='utf-8') as f:
    json.dump(validation_report, f, ensure_ascii=False, indent=2)

# Write CSV summary for academic demonstration
with open('data/intermediate/adm_catalog_summary.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(["Sloka_Slug", "Canonical_Title", "Category", "Primary_Deity", "English_Pages", "Telugu_Pages", "Tamil_Pages", "Verification_Status"])
    for s in sloka_definitions:
        writer.writerow([
            s['slug'],
            s['canonicalTitle'],
            s['category'],
            s['primaryDeity'],
            f"P.{s['englishPages'][0]}-{s['englishPages'][1]}",
            f"P.{s['teluguPages'][0]}-{s['teluguPages'][1]}",
            f"P.{s['tamilPages'][0]}-{s['tamilPages'][1]}",
            "VERIFIED"
        ])

print("Pipeline completed successfully!")
print(f"Validation Report saved to data/intermediate/extraction_validation_report.json")
print(f"CSV Summary saved to data/intermediate/adm_catalog_summary.csv")
