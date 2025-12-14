import { Module, Device, GlossaryTerm } from './types';

export const MODULES: Module[] = [
  {
    id: "M0",
    name: "Şebeke Girişi, Koruma ve EMI/EMC",
    summary: "AC giriş koruması, ani darbe ve EMC uyumluluğu için temel ön uç blok.",
    blocks: ["Sigorta", "MOV/Varistör", "NTC Inrush", "EMI filtre (X/Y cap + CM choke)", "Köprü doğrultma"],
    topologies: [
      {
        name: "EMI filtreleme",
        notes: "Cihazın şebekeye yaydığı ve şebekeden aldığı gürültüyü yönetir.",
        pros: ["EMC uyumu", "Stabil çalışma"],
        cons: ["Maliyet", "Hacim"]
      }
    ],
    typical_components: ["FUSE", "MOV", "NTC", "X2 capacitor", "Y capacitor", "Common-mode choke", "Bridge rectifier"],
    typical_ic_families: ["(Genelde pasif ağırlıklı)"],
    failure_modes: [
      {
        title: "Giriş katı arızası",
        symptoms: ["Cihaz hiç açılmıyor", "Ev sigortası atıyor"],
        root_causes: ["Voltaj dalgalanması sonucu MOV kısa devre", "Diyot köprüsü arızası"],
        checks: ["Görsel kontrol", "Giriş empedansı ölçümü"],
        related_topologies: ["EMI filtreleme"]
      }
    ],
    safety_notes: ["Şebeke tarafı ölümcül gerilim içerir.", "EMI kapasitörleri fiş çekildikten sonra bile yük tutabilir."],
    references: ["IEC 61000", "IEC 60335"]
  },
  {
    id: "M1",
    name: "AC/DC Güç Kaynağı (SMPS)",
    summary: "Kontrol kartı ve sensörleri besleyen ana güç dönüştürme bloğu.",
    blocks: ["HV DC Bus", "PWM Kontrol", "Trafo", "Geri besleme (Opto/TL431)", "Sekonder doğrultma"],
    topologies: [
      {
        name: "Flyback (Offline)",
        notes: "Ev elektroniğinde en yaygın düşük güç topolojisi.",
        pros: ["Ucuz", "Basit", "İzole"],
        cons: ["Verim orta", "EMI yüksek olabilir"]
      },
      {
        name: "LLC Resonant",
        notes: "Yüksek verimlilik gerektiren (TV, PC Adaptörü) yerlerde kullanılır.",
        pros: ["Çok yüksek verim", "Düşük EMI"],
        cons: ["Karmaşık tasarım"]
      }
    ],
    typical_components: ["Switching MOSFET", "PWM IC", "Trafo", "Optocoupler", "TL431", "Schottky Diode", "Low ESR Caps"],
    typical_ic_families: ["Power Integrations LinkSwitch", "OnSemi NCP10xx", "ST VIPer", "Tea17xx"],
    failure_modes: [
      {
        title: "Voltaj çıkış hatası",
        symptoms: ["Cihaz kararsız çalışıyor", "Reset döngüsü"],
        root_causes: ["Çıkış kondansatörlerinde ESR artışı", "Geri besleme döngüsü kopukluğu"],
        checks: ["Sekonder voltaj kararlılığı", "Ripple ölçümü"],
        related_topologies: ["Flyback"]
      }
    ],
    safety_notes: ["Primer kapasitörde 320V DC bulunur.", "İzolasyon aralığına dikkat edilmelidir."],
    references: ["Flyback Converter Design"]
  },
  {
    id: "M2",
    name: "PFC (Güç Faktörü Düzeltme)",
    summary: "Şebekeden sinüzoidal akım çekmek için kullanılan ön regülatör.",
    blocks: ["Boost Inductor", "PFC MOSFET", "Boost Diode", "PFC Controller", "Bulk Capacitor"],
    topologies: [
      {
        name: "Boost PFC",
        notes: "Giriş gerilimini 400V DC seviyesine yükseltir.",
        pros: ["PF > 0.95", "Dünya çapında giriş voltajı"],
        cons: ["Ek maliyet", "Ek ısınma"]
      }
    ],
    typical_components: ["Boost Bobini", "MOSFET", "SiC Diode", "Bulk Capacitor (450V)"],
    typical_ic_families: ["NCP1654", "UCC28019", "L6562"],
    failure_modes: [
      {
        title: "Güç Katı Hasarı",
        symptoms: ["Sigorta atması", "Yanık izleri"],
        root_causes: ["MOSFET aşırı akım", "Yıldırım/Surge etkisi"],
        checks: ["Yarı iletken kısa devre testi"],
        related_topologies: ["Boost PFC"]
      }
    ],
    safety_notes: ["400V DC çok tehlikelidir.", "Deşarj süresi uzundur (dakikalar sürebilir)."],
    references: ["PFC Basics"]
  },
  {
    id: "M3",
    name: "Inverter / Motor Sürücü",
    summary: "BLDC, PMSM veya İndüksiyon motorlarını süren 3-fazlı güç katı.",
    blocks: ["3-Faz Köprü (IGBT/MOSFET)", "Gate Driver", "Shunt Dirençler", "Akım Ölçüm"],
    topologies: [
      {
        name: "3-Faz Inverter + FOC",
        notes: "Sessiz ve verimli sürüş sağlar.",
        pros: ["Yüksek tork", "Sessiz"],
        cons: ["Karmaşık kontrol", "Pahalı sensörler"]
      },
      {
        name: "H-Bridge (DC Motor)",
        notes: "Fırçalı DC motorların yön ve hız kontrolü.",
        pros: ["Basit", "Çift yönlü"],
        cons: ["Fırça gürültüsü"]
      }
    ],
    typical_components: ["IGBT/IPM Module", "Bootstrap kapasitörleri", "Gate dirençleri", "Shunt"],
    typical_ic_families: ["Infineon IPM", "Mitsubishi IPM", "TI DRV83xx"],
    failure_modes: [
      {
        title: "Sürücü Katı Arızası",
        symptoms: ["Motor dönmüyor", "Titreşim"],
        root_causes: ["Faz kaybı", "Gate driver hasarı"],
        checks: ["Faz-faz direnç ölçümü", "IPM kontrol sinyalleri"],
        related_topologies: ["FOC", "6-Step"]
      }
    ],
    safety_notes: ["Motor uçlarında yüksek voltaj PWM bulunur.", "Motor dönerken enerji üretir (BEMF)."],
    references: ["Field Oriented Control"]
  },
  {
    id: "M4",
    name: "Isıtma Güç Katı",
    summary: "Rezistans yüklerini anahtarlayan röle veya yarı iletken yapılar.",
    blocks: ["Triac/Röle", "Opto-izolatör", "Termal Sigorta", "NTC"],
    topologies: [
      {
        name: "Triac Faz Kontrol",
        notes: "Gücü kısmak için sinüs dalgasını keser.",
        pros: ["Hassas kontrol", "Ucuz"],
        cons: ["EMI gürültüsü", "Snubber gerekir"]
      }
    ],
    typical_components: ["BTA16/24 Triac", "MOC30xx Opto", "Röle (16A)", "Termostat"],
    typical_ic_families: ["MOC3021", "MOC3041 (Zero-cross)"],
    failure_modes: [
      {
        title: "Anahtarlama Elemanı Hatası",
        symptoms: ["Kontrolsüz ısıtma", "Isıtmama"],
        root_causes: ["Triac kısa devresi", "Röle kontağı yapışması"],
        checks: ["Eleman iletim testi"],
        related_topologies: ["On-Off", "Faz Kontrol"]
      }
    ],
    safety_notes: ["Isıtıcılar yangın riski taşır.", "Termal sigortalar asla bypass edilmemelidir."],
    references: ["Thyristor Theory"]
  },
  {
    id: "M5",
    name: "İndüksiyon ve HV Sistemler",
    summary: "Manyetik ısıtma (IH) veya Mikrodalga gibi yüksek voltaj/frekans üreten yapılar.",
    blocks: ["Doğrultucu", "LC Tank", "IGBT", "Rezonans Kapasitörü", "Magnetron", "HV Trafo"],
    topologies: [
      {
        name: "Quasi-Resonant Inverter",
        notes: "Tek anahtarlı, maliyet odaklı IH topolojisi.",
        pros: ["Basit", "Ucuz"],
        cons: ["Yüksek voltaj stresi (1000V+)"]
      },
      {
        name: "HV Doubler (Mikrodalga)",
        notes: "AC voltajı katlayarak Magnetronu sürer.",
        pros: ["Basit ve sağlam"],
        cons: ["Çok tehlikeli voltaj (2-4kV)"]
      }
    ],
    typical_components: ["1200V IGBT", "MKP Rezonans Kapasitörü", "Litz teli bobin", "Magnetron", "HV Diyot"],
    typical_ic_families: ["Viper (bazı controllerlar)", "Özel IH MCU'lar"],
    failure_modes: [
      {
        title: "Güç Katı Arızası",
        symptoms: ["Cihaz çalışmıyor", "Sigorta atması"],
        root_causes: ["IGBT kısa devre", "Kapasitör değer kaybı"],
        checks: ["Komponent testi"],
        related_topologies: ["Quasi-Resonant", "Half-Bridge"]
      }
    ],
    safety_notes: ["Çok yüksek manyetik alan.", "Mikrodalga kapasitörü öldürücü yük tutar.", "Kalp pili olanlar yaklaşmamalı."],
    references: ["Induction Heating Basics"]
  },
  {
    id: "M6",
    name: "Sensörler ve Aktüatörler",
    summary: "Fiziksel dünyayı ölçen ve basit yükleri (valf, fan) süren arayüz.",
    blocks: ["ADC", "NTC", "Hall Effect", "Load Cell", "Low-side Switch (ULN2003)"],
    topologies: [
      {
        name: "Low-side Switching",
        notes: "NPN veya N-Channel MOSFET ile yükü toprağa çekme.",
        pros: ["Basit", "Entegre edilebilir (ULN2003)"],
        cons: ["Ortak şase gerektirir"]
      }
    ],
    typical_components: ["NTC", "Reed Röle", "ULN2003", "ACS712 (Akım)", "Flowmetre", "Basınç Sensörü"],
    typical_ic_families: ["ULN2003", "74HC165 (Shift reg)"],
    failure_modes: [
      {
        title: "Sinyal / Geri Besleme Hatası",
        symptoms: ["Hatalı çalışma", "Sensör hata kodları"],
        root_causes: ["Kablo kopukluğu", "Sensör sapması"],
        checks: ["Analog sinyal seviyesi ölçümü"],
        related_topologies: ["Voltage Divider", "Bridge"]
      }
    ],
    safety_notes: ["Su ile temas eden sensörlerde izolasyon hayati önem taşır."],
    references: ["Sensor Interfacing"]
  },
  {
    id: "M7",
    name: "Haberleşme / Akıllı Sistemler",
    summary: "Kullanıcı arayüzü, Wi-Fi bağlantısı ve ana işlemci mantığı.",
    blocks: ["MCU", "Wi-Fi/BLE Modül", "Display Driver", "Touch Sensör", "SoC"],
    topologies: [
      {
        name: "SoC + Buck Regülatör",
        notes: "Hassas dijital devreler için temiz düşük voltaj (3.3V/1.8V).",
        pros: ["Verimli", "Kompakt"],
        cons: ["Gürültü hassasiyeti"]
      }
    ],
    typical_components: ["ESP32", "STM32", "7-segment LED", "TFT Ekran", "Touch yayları", "CPU"],
    typical_ic_families: ["ESP32-WROOM", "TM1637 (LED Driver)", "Rockchip"],
    failure_modes: [
      {
        title: "Mantık / Kontrol Hatası",
        symptoms: ["Kilitlenme", "Ekran yok"],
        root_causes: ["Besleme voltajı kararsızlığı", "Yazılım hatası"],
        checks: ["3.3V rayı gürültü ölçümü"],
        related_topologies: ["Buck Converter", "LDO"]
      }
    ],
    safety_notes: ["Genelde düşük voltajdır ancak şebeke izolasyonu yoksa dokunmak tehlikelidir (Non-isolated supply)."],
    references: ["Embedded System Design"]
  }
];

export const DEVICES: Device[] = [
  // --- MUTFAK ELEKTRONİĞİ ---
  {
    id: "buzdolabi",
    name: "Buzdolabı (No-Frost / Inverter)",
    category: "Mutfak Elektroniği",
    tags: ["soğutma", "inverter", "kompresör", "7/24"],
    // Image: Cooling coils and structure close up (representing internal mechanics)
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
    overview: "Bu sistem, termodinamik soğutma çevrimini hassas bir elektronik kontrol mimarisi ile yönetir. Geleneksel 'dur-kalk' (on/off) kontrolün aksine, **Inverter** teknolojisi sayesinde kompresör devri (RPM) ve torku soğutma ihtiyacına göre dinamik olarak ayarlanır.",
    working_principle: [
      "Kullanıcı arayüzünden hedef sıcaklık **Set Değeri** girilir ve **MCU** tarafından kaydedilir.",
      "**MCU**, dolap içindeki **NTC** sensörlerin direncini ölçerek anlık sıcaklık verisini toplar.",
      "Sıcaklık farkı (Error) yüksekse, **MCU** **IPM** modülüne yüksek frekanslı **PWM** sinyalleri gönderir.",
      "**IPM** modülü, DC Bus voltajını anahtarlayarak kompresör motoruna değişken frekanslı 3-Faz AC akım uygular (**FOC** Sürüş).",
      "Kompresör çalışarak soğutucu akışkanı sıkıştırır; gaz kondenserde sıvılaşır ve evaporatörde buharlaşarak ortamdan ısı çeker.",
      "**MCU**, evaporatör sıcaklığını izler; buzlanma tespit ederse kompresörü durdurur ve **Defrost** rezistansını (Röle ile) devreye alır."
    ],
    module_map: [
      { moduleId: "M0", role: "Giriş EMI ve Koruma" },
      { moduleId: "M1", role: "Kart Beslemesi (SMPS)" },
      { moduleId: "M3", role: "Kompresör Inverter Sürücü" },
      { moduleId: "M4", role: "Defrost Isıtıcı Kontrol" },
      { moduleId: "M6", role: "NTC, Fan ve Kapı Sensörleri" }
    ],
    topologies_used: ["Flyback SMPS", "3-faz FOC Inverter", "Röle Kontrol"],
    typical_components: ["IPM Modülü", "HV Kapasitör (400V)", "Defrost Rölesi", "NTC (10k)"],
    typical_ic_families: ["Jia/Smart IPM", "Renesas RX MCU"],
    failure_scenarios: [
      {
        title: "Kompresör kalkış hatası",
        symptoms: ["Kompresör çalışmıyor", "Tık sesi", "Soğutma yok"],
        likely_modules: ["M3", "M1"],
        likely_components: ["HV DC Kapasitör", "IPM Modülü"],
        notes: "DC Bus kapasitörü değer kaybederse, motor kalkış anındaki yüksek akım talebini karşılayamaz ve voltaj çöker."
      },
      {
        title: "Hava sirkülasyon sorunu",
        symptoms: ["Alt bölme soğutmuyor", "Üst bölme buzlanmış"],
        likely_modules: ["M6", "M4"],
        likely_components: ["Evaporatör Fanı", "Defrost Sensörü", "Termal Sigorta"],
        notes: "Defrost sistemi çalışmazsa evaporatör buzla kaplanır, fan havayı kanallara üfleyemez."
      }
    ],
    learning_notes: {
      what_to_learn: ["Buhar sıkıştırmalı soğutma döngüsü ve kılcal boru (capillary tube) basınç düşümü.", "NTC sensörler için Beta katsayısı ve sıcaklık-direnç tablolarının okunması.", "3-Faz Inverter çıkış sinyallerinin (U-V-W) osiloskop ile analizi."],
      common_misconceptions: ["Gaz bitmesi sanılanın aksine nadirdir; sistem kapalı devredir. Genelde sorun sensör, fan, damper veya tıkanıklıktır.", "Inverter kartı bozuk sanılırken aslında kompresör sargıları kısa devre olabilir."],
      practical_insights: ["Inverter kartlarında, kompresör soketi çıkarıldığında kart korumaya geçip voltaj vermeyi kesebilir, ölçümü zorlaştırır.", "Defrost rezistansları genellikle cam tüp içindedir ve darbeyle kırılabilir."]
    },
    safety_notes: ["Kompresör sargıları enerji kesildikten sonra bile BEMF üretebilir."]
  },
  {
    id: "espresso_makinesi",
    name: "Espresso Makinesi",
    category: "Mutfak Elektroniği",
    tags: ["pompa", "basınç", "termoblok", "valf"],
    // Image: Espresso extraction close up showing liquid mechanics
    imageUrl: "https://images.unsplash.com/photo-1590157973009-3221976a4407?auto=format&fit=crop&q=80&w=800",
    overview: "Espresso makineleri, suyu yüksek basınç (9 bar) altında kahve yatağından geçirmek için vibrasyon pompası ve hassas sıcaklık kontrolü (PID) kullanır.",
    working_principle: [
      "Kullanıcı düğmeye bastığında **MCU**, suyu ısıtmak için Termoblok/Kazan rezistansını devreye alır.",
      "**NTC** sensör sıcaklığın 93°C'ye ulaştığını doğruladığında pompa başlatılır.",
      "**Vibrasyon Pompası** (ULKA tipi), suyu tanktan çeker ve basınçlandırır.",
      "**3-Yollu Solenoid Valf** açılarak basınçlı suyun grup başlığına gitmesine izin verir.",
      "İşlem bittiğinde valf kapanır ve grup başlığındaki artık basıncı tahliye tepsisine boşaltır."
    ],
    module_map: [
      { moduleId: "M4", role: "Isıtıcı (Termoblok) ve Pompa Kontrol" },
      { moduleId: "M6", role: "Akışmetre, NTC, Basınç Sensörü" },
      { moduleId: "M7", role: "PID Kontrolcü" }
    ],
    topologies_used: ["Phase Angle Control (Pump)", "PID Temperature Control"],
    typical_components: ["ULKA Pompa", "Solenoid Valf", "Termoblok", "SSR (Solid State Relay)"],
    typical_ic_families: ["-"],
    failure_scenarios: [
      {
        title: "Su gelmiyor / Pompa sesi zayıf",
        symptoms: ["Pompa inliyor ama su akmıyor"],
        likely_modules: ["M6"],
        likely_components: ["Pompa diyotu", "Kireç tıkanıklığı"],
        notes: "Vibrasyon pompaları yarım dalga doğrultma ile çalışır, diyot bozulursa güç düşer."
      }
    ],
    learning_notes: {
      what_to_learn: ["PID kontrol katsayılarının (Kp, Ki, Kd) termal kararlılığa etkisi.", "3 yollu solenoid valfin çalışma mekaniği ve 'backflush' işlemi.", "Vibrasyon pompalarında diyotun önemi (yarım dalga doğrultma)."],
      common_misconceptions: ["Pompa sesli çalışıyorsa kesin bozuktur (susuz kalmış veya hava yapmış olabilir).", "Basınç düşüklüğü her zaman pompa sorunudur (OPV valfi veya kireçlenme de olabilir)."],
      practical_insights: ["Akışmetre (Flowmeter) Hall effect sensörü içerir, mıknatıs kireçten dönemezse MCU su yok sanar.", "Termobloklar alüminyum olduğu için sitrik asit ile kireç çözülmelidir, sirke zarar verebilir."]
    },
    safety_notes: ["Yüksek basınçlı su ve buhar yanık riski oluşturur."]
  },
  {
    id: "su_sebili",
    name: "Su Sebili",
    category: "Mutfak Elektroniği",
    tags: ["peltier", "kompresör", "ısıtma"],
    // Image: Clean water pouring mechanism
    imageUrl: "https://images.unsplash.com/photo-1621946890332-68c37d403980?auto=format&fit=crop&q=80&w=800",
    overview: "Su sebilleri, suyu aynı anda hem ısıtan (rezistans) hem de soğutan (kompresör veya peltier) çift depolu termal sistemlerdir.",
    working_principle: [
      "Soğutma için: Kompresörlü modellerde buzdolabı mantığı işler. **Peltier**'li modellerde ise DC akım ile yarı iletken yüzeyin bir tarafı soğur, diğer tarafı ısınır.",
      "Isıtma için: Sıcak su tankındaki harici kuşak rezistans suyu 85-95°C aralığında tutar.",
      "Bimetal termostatlar, her iki tankın sıcaklığını bağımsız olarak kontrol eder.",
      "Sıcak su tankında susuz çalışmayı önleyen manuel resetli ikinci bir emniyet termostatı bulunur."
    ],
    module_map: [
      { moduleId: "M4", role: "Isıtıcı ve Kompresör Rölesi" },
      { moduleId: "M1", role: "SMPS (Peltier modellerde)" },
      { moduleId: "M6", role: "Termostatlar" }
    ],
    topologies_used: ["On-Off Control", "Peltier Cooling"],
    typical_components: ["Peltier Modülü (TEC1-12706)", "Kuşak Rezistans", "Bimetal Termostat"],
    typical_ic_families: ["-"],
    failure_scenarios: [
      {
        title: "Su soğutmuyor (Peltier model)",
        symptoms: ["Fan çalışıyor ama su ılık"],
        likely_modules: ["M1"],
        likely_components: ["Peltier modülü", "SMPS kapasitörleri"],
        notes: "Peltier modülleri zamanla termal stres nedeniyle çatlar ve işlevini yitirir."
      }
    ],
    learning_notes: {
      what_to_learn: ["Peltier (Termoelektrik) etkisi ve Seebeck/Peltier katsayıları.", "Kuşak rezistansların ısı transfer verimliliği.", "Termostat histeresis döngüsü (Örn: 85°C aç, 95°C kapat)."],
      common_misconceptions: ["Peltier modellerde gaz bitti sanılması (gaz yoktur, yarı iletken soğutma vardır).", "Sıcak su akmıyorsa musluk bozuktur (hava yapmış olabilir, 'airlock')."],
      practical_insights: ["Peltier modülünün arkasındaki fan durursa, modül saniyeler içinde aşırı ısınıp bozulur.", "Sıcak su tankındaki manuel resetli termostat atıksa, tank susuz çalışmış demektir."]
    },
    safety_notes: ["Sıcak su tankı basınç altında patlayabilir (havalık tıkalıysa)."]
  },
  {
    id: "su_isiticisi",
    name: "Su Isıtıcı (Kettle)",
    category: "Mutfak Elektroniği",
    tags: ["ısıtıcı", "bimetal", "basit"],
    // Image: Boiling water and steam dynamics
    imageUrl: "https://images.unsplash.com/photo-1556910636-cd24b486018d?auto=format&fit=crop&q=80&w=800",
    overview: "Kettle, suyun kaynama noktasında ürettiği buharı mekanik bir geri besleme olarak kullanan, yüksek güçlü bir rezistif ısıtıcıdır. Elektronik kart içermez, tamamen fiziksel prensiplerle çalışır.",
    working_principle: [
      "Kullanıcı anahtara bastığında şebeke gerilimi tabandaki **Spiral Rezistans**'a uygulanır (1500W-2200W).",
      "Su ısınmaya başlar ve sonunda kaynar.",
      "Kaynama ile oluşan yoğun buhar, sapın içindeki gizli bir kanaldan **Bimetal Diske** yönlendirilir.",
      "Sıcak buharla temas eden bimetal disk genleşerek şekil değiştirir (çıt sesi).",
      "Bu mekanik hareket, anahtarın mandalını iterek devreyi fiziksel olarak açar ve elektriği keser."
    ],
    module_map: [
      { moduleId: "M4", role: "Yüksek Güç Rezistansı" },
      { moduleId: "M6", role: "Bimetal Termostat (Sensör+Aktüatör)" }
    ],
    topologies_used: ["Mechanical Switch Control"],
    typical_components: ["Gizli Rezistans", "Bimetal Termostat", "Neon Lamba"],
    typical_ic_families: ["Strix / Otter Controls (Termostat markaları)"],
    failure_scenarios: [
      {
        title: "Su kaynıyor ama atmıyor",
        symptoms: ["Sürekli kaynıyor, oda buhar doldu"],
        likely_modules: ["M6"],
        likely_components: ["Kapak contası", "Buhar kanalı"],
        notes: "Kapak tam kapanmazsa veya filtre tıkalıysa, buhar bimetal sensöre yeterli basınçla ulaşamaz."
      },
      {
        title: "Hiç çalışmıyor",
        symptoms: ["Işık yanmıyor, ısıtma yok"],
        likely_modules: ["M0"],
        likely_components: ["Alt taban kontakları", "Termostat"],
        notes: "Tabandaki bakır kontaklar zamanla oksitlenir veya ark yaparak erir."
      }
    ],
    learning_notes: {
      what_to_learn: ["Bimetal malzemenin termal davranışı ve ani hareket (snap-action) mekaniği.", "Yüksek akım geçişlerinde kontak direncinin (Contact Resistance) ısınmaya etkisi (I²R kayıpları).", "Termal atalet (Thermal Inertia) kavramı."],
      common_misconceptions: ["Suyun sıcaklığını ölçen elektronik bir sensörü vardır (aslında buhar basıncı/sıcaklığı ile tetiklenir).", "Rezistans kireçlenince daha geç ısınır (Enerji korunumuna göre elektrik yine ısıya dönüşür ama transfer yavaşladığı için rezistansın içi aşırı ısınır ve tel kopabilir)."],
      practical_insights: ["Otter ve Strix marka kontrolcüler endüstri standardıdır ve genelde tamir edilmez, değiştirilir.", "Taban kontaklarındaki ark izleri zımparalanarak geçici çözüm sağlanabilir ama yay özelliğini yitirdiyse değişmelidir."]
    },
    safety_notes: ["Cihaz topraklamasız prizde kullanılmamalıdır. Rezistans kaçak yapabilir."]
  },
  {
    id: "bulasik_makinesi",
    name: "Bulaşık Makinesi",
    category: "Mutfak Elektroniği",
    tags: ["su", "ısıtıcı", "sirkülasyon", "pompa"],
    // Image: Inside of a dishwasher
    imageUrl: "https://images.unsplash.com/photo-1585832695846-91e813a86c67?auto=format&fit=crop&q=80&w=800",
    overview: "Bu cihaz, hidro-mekanik süreçleri gelişmiş elektronik kontrol ile yöneten bir otomasyon sistemidir. Yüksek verimli **BLDC** sirkülasyon pompası, suyun basıncını ve debisini yıkama programına göre ayarlar.",
    working_principle: [
      "Başlangıçta, **MCU** tahliye pompasını (Manyetik) çalıştırarak haznedeki artık suyu boşaltır.",
      "Su giriş valfi açılır; **Flowmetre**, türbinin dönüşünü sayarak (Pulse) alınan su miktarını **MCU**'ya bildirir.",
      "Yeterli su alındığında, **BLDC** sirkülasyon pompası devreye girer ve suyu pervanelere basar.",
      "**MCU**, pompa üzerindeki NTC ile su sıcaklığını okur ve ısıtıcıyı (Röle üzerinden) aktif eder.",
      "Optik **Turbidity** sensörü suyun bulanıklığını ölçer; su temizse durulama adımına geçilir.",
      "Yıkama sonunda, yoğuşma veya fan yardımıyla kurutma işlemi yapılır ve program sonlandırılır."
    ],
    module_map: [
      { moduleId: "M0", role: "Giriş" },
      { moduleId: "M1", role: "Kart Besleme" },
      { moduleId: "M3", role: "Sirkülasyon Pompası (BLDC)" },
      { moduleId: "M4", role: "Su Isıtıcı (Tüp rezistans)" },
      { moduleId: "M6", role: "Tahliye, Tuz valfi, NTC, Akış sayacı" }
    ],
    topologies_used: ["BLDC Pump Driver", "Triac Control"],
    typical_components: ["Isıtıcılı Sirkülasyon Pompası", "Optik Su Sensörü", "NTC"],
    typical_ic_families: ["Integrated Pump Driver", "STM8/32"],
    failure_scenarios: [
      {
        title: "Isıtma hatası",
        symptoms: ["Bulaşıklar ıslak ve kirli", "Program çok uzun sürüyor"],
        likely_modules: ["M4", "M3"],
        likely_components: ["Isıtıcı rölesi", "Rezistans", "NTC sensör"],
        notes: "Isıtıcı rölesinin lehimleri yüksek akımdan dolayı zamanla çatlar (Soğuk lehim)."
      }
    ],
    learning_notes: {
      what_to_learn: ["BLDC motorlu entegre ısıtıcı pompalar ve tako (tacho) geri beslemesi.", "Bulanıklık (Turbidity) sensörünün IR led ve fototransistör ile çalışma mantığı.", "Reçine tankı ve rejenerasyon valfinin iyon değiştirme kimyası."],
      common_misconceptions: ["Makine su almıyorsa sadece valf bozuktur (Taşma şamandırası aktifse veya anakart valf triyağı patlaksa da su almaz).", "Tablet deterjan erimiyorsa su soğuktur (Pervaneler dönmüyor veya su seviyesi yetersiz de olabilir)."],
      practical_insights: ["Isıtıcı pompaların burçları zamanla aşınır ve rotor yalpalayarak dönmeye çalışır, bu da aşırı akım hatalarına yol açar.", "Diverter (yönlendirici) valf arızalanırsa sadece alt veya sadece üst pervane döner."]
    },
    safety_notes: ["Alt hazne su toplarsa güvenlik svici (taşma) tüm sistemi elektriksel olarak keser."]
  },
  {
    id: "induksiyon_ocak",
    name: "İndüksiyon Ocak",
    category: "Mutfak Elektroniği",
    tags: ["yüksek güç", "manyetik", "rezonans"],
    // Image: Induction coil copper winding
    imageUrl: "https://images.unsplash.com/photo-1545620958-3d23719a7972?auto=format&fit=crop&q=80&w=800",
    overview: "İndüksiyon teknolojisi, elektromanyetik enerjiyi doğrudan ısı enerjisine dönüştüren yüksek frekanslı bir rezonans devresine dayanır. Sistem, şebeke frekansını (50Hz) alıp 20-50kHz seviyesine yükselterek manyetik bir alan oluşturur.",
    working_principle: [
      "Şebeke gerilimi, güçlü bir köprü diyot ile doğrultularak yüksek voltajlı **DC Bus** oluşturulur.",
      "**MCU**, tencere algılama sinyallerini gönderir (kısa darbeler).",
      "Uygun tencere algılanırsa, **IGBT** 20-50kHz frekansında anahtarlamaya başlar.",
      "Anahtarlama ile rezonans kapasitörü ve bakır bobin (**LC Tank**) üzerinde yüksek frekanslı salınım oluşur.",
      "Bobin üzerinde oluşan değişken manyetik alan, ferromanyetik tencere tabanında **Eddy Akımları** indükler.",
      "Tencere tabanının iç direnci bu akımları doğrudan ısıya dönüştürür (Joule Isınması).",
      "**MCU**, **IGBT** sıcaklığını ve şebeke akımını sürekli izleyerek sistemi korur."
    ],
    module_map: [
      { moduleId: "M0", role: "Güçlü Giriş Filtresi" },
      { moduleId: "M5", role: "Rezonans İnverter ve Bobin" },
      { moduleId: "M6", role: "NTC, Fan, Akım Trafosu" },
      { moduleId: "M7", role: "Dokunmatik Panel" }
    ],
    topologies_used: ["Quasi-Resonant Inverter", "Half-Bridge Resonant"],
    typical_components: ["IGBT (60A)", "Bridge Rectifier (25A)", "MKP Cap", "Fan"],
    typical_ic_families: ["Induction dedicated MCUs"],
    failure_scenarios: [
      {
        title: "Güç katı kısa devresi",
        symptoms: ["Sigorta atıyor", "Patlama sesi"],
        likely_modules: ["M5", "M0"],
        likely_components: ["IGBT", "Köprü Diyot", "Gate Sürücü Transistörleri"],
        notes: "IGBT bozulduğunda genellikle Gate pininden kontrolcüye yüksek voltaj kaçar ve sürücü devresini de yakar."
      }
    ],
    learning_notes: {
      what_to_learn: ["LC Rezonans devreleri ve ZVS (Zero Voltage Switching) prensibi.", "IGBT Gate sürüş sinyalleri ve Miller platosu.", "Litz tellerinin yüksek frekansta deri etkisi (Skin Effect) kaybını azaltması."],
      common_misconceptions: ["Her metal tencere çalışır (Sadece ferromanyetik, yani mıknatıs tutan tabanlar çalışır).", "Cam yüzey ısınmaz (Tencereden cama ısı iletimi olur, bu yüzden 'sıcak yüzey' uyarısı çıkar)."],
      practical_insights: ["Termal macun kurumuşsa, ortadaki NTC sensör sıcaklığı doğru okuyamaz ve ocak erkenden hataya geçer.", "IGBT değişiminde mutlaka Gate sürücü transistörleri (push-pull çifti) de kontrol edilmelidir."]
    },
    safety_notes: ["IGBT soğutucusu bazı topolojilerde canlı (live) potansiyelde olabilir!"]
  },
  {
    id: "tost_makinesi",
    name: "Tost Makinesi",
    category: "Mutfak Elektroniği",
    tags: ["rezistans", "termik", "basit"],
    // Image: Heating elements glowing
    imageUrl: "https://images.unsplash.com/photo-1542838775-6e54e47be4dd?auto=format&fit=crop&q=80&w=800",
    overview: "Tost makinesi, elektrik enerjisini doğrudan ısıya çeviren, yüksek akım çeken seri bağlı rezistans plakalarından oluşur. Sıcaklık kontrolü genellikle mekanik termostat ile sağlanır.",
    working_principle: [
      "Fiş takıldığında şebeke gerilimi anahtar üzerinden termostata gelir.",
      "**Termostat** kapalı konumdaysa, akım seri bağlı alt ve üst rezistans plakalarından geçer.",
      "Rezistanslar ısınır (Joule etkisi) ve döküm plakaları ısıtır.",
      "Plaka sıcaklığı ayarlanan değere gelince, termostat içindeki bimetal şerit eğilerek kontağı açar.",
      "Sıcaklık düşünce bimetal eski haline döner ve devre tekrar tamamlanır (Histerezis döngüsü)."
    ],
    module_map: [
      { moduleId: "M4", role: "Isıtıcı Plakalar" },
      { moduleId: "M6", role: "Mekanik Termostat" }
    ],
    topologies_used: ["On-Off Control"],
    typical_components: ["Mika yalıtımlı Rezistans", "Bimetal Termostat", "Termik Sigorta"],
    typical_ic_families: ["-"],
    failure_scenarios: [
      {
        title: "Hiç ısınmıyor",
        symptoms: ["Işık yanmıyor, plakalar soğuk"],
        likely_modules: ["M0", "M4"],
        likely_components: ["Termik sigorta", "Kablo kopuğu"],
        notes: "Aşırı ısınma durumunda (termostat yapışırsa) termik sigorta (örn: 240°C) atarak yangını önler."
      }
    ],
    learning_notes: {
      what_to_learn: ["Nikel-Krom (NiCr) rezistans telinin özellikleri.", "Seri devrelerde voltaj düşümü analizi.", "Ekmek kızartma makinelerindeki elektromıknatıs tutuculu zamanlayıcı devreleri (RC deşarj)."],
      common_misconceptions: ["Rezistans teli koptu (Genelde sorun termik sigorta, kablo veya termostattadır).", "Termostat bozulursa cihaz çalışmaz (Aksine, termostat yapışırsa cihaz sürekli çalışır ve yangın çıkarabilir, termik sigorta burada devreye girer)."],
      practical_insights: ["Termik sigorta değiştirilirken asla lehim yapılmaz, sıkıştırma (krimp) pabuç kullanılır çünkü lehim erir.", "Kırıntı tepsisinde biriken karbonlaşmış ekmekler iletken hale gelip gövdeye kaçak yapabilir."]
    },
    safety_notes: ["Metal gövde topraklaması hayati önem taşır."]
  },
  {
    id: "mikrodalga",
    name: "Mikrodalga Fırın",
    category: "Mutfak Elektroniği",
    tags: ["yüksek voltaj", "ısıtma", "magnetron"],
    // Image: Internal microwave light/cavity
    imageUrl: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&q=80&w=800",
    overview: "Mikrodalga fırın, şebeke enerjisini 2.45 GHz frekansında yüksek güçlü RF enerjisine dönüştüren bir **HV** (Yüksek Gerilim) sistemidir.",
    working_principle: [
      "Kullanıcı kapıyı kapatır; 3 adet güvenlik switch'i (Interlock) seri devreyi tamamlar.",
      "Zamanlayıcı başlatıldığında, primer sargıya 220V uygulanır.",
      "**HV Trafosu**, voltajı yaklaşık 2000V AC seviyesine yükseltir.",
      "**HV Diyot** ve **Kapasitör**, bu gerilimi dublör (Voltage Doubler) devresiyle ~4000V DC'ye çıkarır.",
      "**Magnetron**, bu yüksek voltajla 2.45 GHz frekansında RF dalgaları üretir.",
      "Dalga kılavuzu (Waveguide), enerjiyi pişirme haznesine iletir ve su molekülleri titreştirir."
    ],
    module_map: [
      { moduleId: "M0", role: "Giriş Sigorta ve Kapı Switchleri" },
      { moduleId: "M5", role: "HV Trafosu, Kapasitör, Diyot, Magnetron" },
      { moduleId: "M7", role: "Zamanlayıcı ve Kontrol" },
      { moduleId: "M6", role: "Döner Tabla Motoru, Fan" }
    ],
    topologies_used: ["HV Voltage Doubler", "Linear Power Supply"],
    typical_components: ["Magnetron", "HV Kapasitör (1uF 2100V)", "HV Diyot", "Mika Levha"],
    typical_ic_families: ["Mekanik zamanlayıcı veya basit MCU"],
    failure_scenarios: [
      {
        title: "Kıvılcım ve ark oluşumu",
        symptoms: ["Fırın içinden patlama sesleri", "Şimşek görüntüsü"],
        likely_modules: ["M5"],
        likely_components: ["Mika (Yalıtkan) levha", "Magnetron anteni"],
        notes: "Dalga çıkışındaki mika levha yağlanıp yanarsa karbonlaşır (iletkenleşir) ve antene ark atlar."
      },
      {
        title: "Isıtmama problemi",
        symptoms: ["Fan çalışıyor, ışık yanıyor ama ısıtma yok"],
        likely_modules: ["M5"],
        likely_components: ["HV Sigorta", "Magnetron", "HV Diyot"],
        notes: "HV sigortası genellikle beyaz plastik bir kapsül içindedir ve sadece HV kısa devresinde atar."
      }
    ],
    learning_notes: {
      what_to_learn: ["Yarım dalga voltaj katlayıcı (Half-wave voltage doubler) devre analizi.", "Kapı kilit mekanizması (Interlock) ve Monitör Switch'in güvenlik fonksiyonu.", "Magnetron flaman direncinin ölçülmesi (Çok düşük ohm, <1Ω)."],
      common_misconceptions: ["Magnetron bitti (Genelde HV diyot kısa devredir veya HV sigorta atmıştır).", "Metal koyunca patlar (Metal mikrodalgaları yansıtır, sivri uçlu metaller ark oluşturur ama her metal patlamaz)."],
      practical_insights: ["HV kapasitörü deşarj etmeden asla dokunmayın, fiş çekilse bile ölümcül enerji saklar.", "Monitor switch arızalıysa cihaz her kapı açıldığında ana sigortayı attıracak şekilde tasarlanmıştır (Güvenlik önlemi)."]
    },
    safety_notes: ["Cihaz fişten çekilse bile HV kapasitör 2000V+ yük tutabilir. Radyasyon sızıntısı riski vardır."]
  },
  {
    id: "airfryer",
    name: "Airfryer (Sıcak Hava Fritözü)",
    category: "Mutfak Elektroniği",
    tags: ["konveksiyon", "ısıtıcı", "fan", "popüler"],
    // Image: Heating element or fan assembly
    imageUrl: "https://images.unsplash.com/photo-1626168868840-77a3d314818e?auto=format&fit=crop&q=80&w=800",
    overview: "Airfryer, yüksek hızlı konveksiyonel ısı transferi prensibine dayanan, kompakt ve yüksek güçlü bir fırındır. Aerodinamik tasarımı, ısıyı yiyecek yüzeyinde yoğunlaştırır.",
    working_principle: [
      "Sepet yerine oturduğunda güvenlik anahtarı (Microswitch) ana güç hattını birleştirir.",
      "Kullanıcı ayarına göre **MCU**, rezistans rölesini kapatır ve fan motorunu başlatır.",
      "Rezistans tarafından ısıtılan hava, fan tarafından sepete doğru güçlü bir şekilde üflenir (Konveksiyon).",
      "Sepet tabanındaki özel tasarım (Yıldız vb.), sıcak havayı yukarı doğru döndürür (Sirkülasyon).",
      "**NTC** sensörü anlık sıcaklığı bildirir; hedef sıcaklığa ulaşınca **MCU** rezistansı periyodik olarak açıp kapatır.",
      "Süre bitiminde sistem rezistansı kapatır ancak fanı bir süre daha çalıştırarak soğutma yapar."
    ],
    module_map: [
      { moduleId: "M1", role: "SMPS (12V/5V)" },
      { moduleId: "M4", role: "Rezistans Kontrolü (Röle)" },
      { moduleId: "M6", role: "Fan Motoru (AC veya DC), NTC, Sepet Switci" },
      { moduleId: "M7", role: "Dokunmatik Ekran" }
    ],
    topologies_used: ["On-Off Hysteresis Control", "Buck Converter"],
    typical_components: ["Spiral Rezistans", "Fan Motoru (Shaded Pole)", "Termal Sigorta"],
    typical_ic_families: ["Touch controller ICs"],
    failure_scenarios: [
      {
        title: "Cihaz hiç açılmıyor",
        symptoms: ["Ekran yok, tepki yok"],
        likely_modules: ["M4", "M1"],
        likely_components: ["Termal sigorta", "Sepet sensörü (Microswitch)"],
        notes: "Sepet tam oturmazsa güvenlik switchi devreyi tamamlamaz."
      },
      {
        title: "Aşırı ısınma / Koku",
        symptoms: ["Yanık plastik kokusu", "Fan sesi yok"],
        likely_modules: ["M6"],
        likely_components: ["Fan motoru", "Fan kapasitörü"],
        notes: "Fan durursa rezistans üzerindeki ısı atılamaz ve termal sigorta devreyi keser."
      }
    ],
    learning_notes: {
      what_to_learn: ["Konveksiyonel ısı transfer katsayısı ve hava akış dinamiği.", "Ucuz modellerde Histerezis (On/Off) vs. pahalı modellerde PID kontrol.", "Gölge kutuplu (Shaded Pole) motorların yapısı."],
      common_misconceptions: ["Rezistans bozuk (Genelde koruyucu termik sigorta atmıştır).", "Fan motoru dönmüyorsa yanmıştır (Bazen sadece yağ buharından dolayı yatakları sıkışmıştır, temizlenirse çalışır)."],
      practical_insights: ["Fan pervanesi gevşerse gövdeye sürter ve korkunç sesler çıkarır.", "Sepet sivici genellikle mekanik olarak zorlanan bir parçadır ve lehim yerlerinden kırılabilir."]
    },
    safety_notes: ["Yüksek sıcaklıklar plastik gövdeyi eritebilir."]
  },
  
  // --- TEMİZLİK VE BANYO GRUBU ---
  {
    id: "camasir_makinesi",
    name: "Çamaşır Makinesi",
    category: "Temizlik ve Banyo Grubu",
    tags: ["motor", "su", "ısıtıcı", "titreşim"],
    // Image: Drum close up showing mechanical texture
    imageUrl: "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?auto=format&fit=crop&q=80&w=800",
    overview: "Modern çamaşır makineleri, su, sıcaklık, mekanik hareket ve kimyasalları yöneten sofistike robotlardır. Sistemin kalbi, motor kontrolü ve sensör yönetimini sağlayan ana karttır.",
    working_principle: [
      "Başlat komutuyla **PTC** kapı kilidi ısınarak kapıyı mekanik olarak kilitler.",
      "**MCU**, giriş valfini açar; presostattan gelen frekans (kHz) düşerek su seviyesinin yükseldiğini bildirir.",
      "**Inverter** (IPM), motoru düşük devirde sağa-sola döndürerek çamaşırı ıslatır.",
      "Isıtıcı rölesi çeker ve **NTC** ile hedeflenen sıcaklığa kadar su ısıtılır.",
      "Yıkama bitince tahliye pompası (Manyetik) suyu boşaltır.",
      "Sıkma evresinde **MCU**, dengesiz yük kontrolü yapar ve motoru kademeli olarak yüksek devire (1000+ RPM) çıkarır."
    ],
    module_map: [
      { moduleId: "M0", role: "Giriş Filtre" },
      { moduleId: "M1", role: "Kart Besleme" },
      { moduleId: "M3", role: "Tambur Motor Sürücü" },
      { moduleId: "M4", role: "Su Isıtıcı" },
      { moduleId: "M6", role: "Valf, Pompa, Kapı Kilidi, Presostat" }
    ],
    topologies_used: ["FOC Motor Control", "Triac AC Switch"],
    typical_components: ["IGBT", "Triac (T435)", "Röle", "Presostat (Basınç Sensörü)"],
    typical_ic_families: ["IKCM15F60GA", "ACS108 (Valf Triac)"],
    failure_scenarios: [
      {
        title: "Su boşaltma hatası",
        symptoms: ["Program bitmiyor", "E18/E20 hatası"],
        likely_modules: ["M6"],
        likely_components: ["Pompa motoru", "Pompa Triac'ı"],
        notes: "Pompa pervanesine sıkışan cisimler (bozuk para vb.) pompayı kilitler."
      },
      {
        title: "Motor dönmeme / İnleme",
        symptoms: ["Tambur dönmüyor", "Kayış sağlam"],
        likely_modules: ["M3"],
        likely_components: ["Inverter Modülü", "Motor Sargıları"],
        notes: "Inverter sürücü (IPM) çıkışlarından biri yanarsa motor kalkış yapamaz."
      }
    ],
    learning_notes: {
      what_to_learn: ["Dengesiz yük algılama algoritmaları (Akım dalgalanması analizi).", "Elektronik presostatların frekans tabanlı (LC osilatör) çalışma mantığı.", "Universal motorlarda kömür fırça aşınması vs. Inverter motor ömrü."],
      common_misconceptions: ["Kapı kilitlenmiyorsa mekanizma bozuktur (Bazen karttaki triac bozuk olduğu için kilide enerji gitmez).", "Makine sıkmaya geçmiyorsa motor bozuktur (Dengesiz yük veya su boşaltamama durumunda da sıkma yapmaz)."],
      practical_insights: ["Su valfleri ve pompalar 220V AC ile çalışır, test ederken dikkat edilmelidir.", "Manyetik (Askoll tipi) tahliye pompaları bozulduklarında genellikle ses yapar veya bazen çalışıp bazen çalışmaz (kararsız)."]
    },
    safety_notes: ["Su ve elektrik bir arada. Topraklama hayati."]
  },
  {
    id: "kurutma_makinesi",
    name: "Kurutma Makinesi",
    category: "Temizlik ve Banyo Grubu",
    tags: ["ısı pompası", "nem", "motor"],
    // Image: Heat pump dryer internal drum texture
    imageUrl: "https://images.unsplash.com/photo-1626806775351-5380685404e9?auto=format&fit=crop&q=80&w=800",
    overview: "Isı pompalı (Heat Pump) kurutma makineleri, kapalı devre bir soğutma sistemi (kompresör, evaporatör, kondenser) kullanarak enerji verimliliğini maksimize eder.",
    working_principle: [
      "Program başladığında, kompresör (**Isı Pompası**) çalışarak sistemdeki gazı sıkıştırır ve ısıtır.",
      "Fan, ısınan havayı tambur içindeki ıslak çamaşırların üzerinden geçirir.",
      "Neme doymuş sıcak hava, soğuk evaporatör peteklerine çarpar.",
      "Ani soğuma ile havadaki nem suya dönüşür (**Yoğuşma**) ve tanka pompalanır.",
      "Nemi alınmış kuru hava, tekrar kondenserden geçerek ısınır ve döngüye devam eder.",
      "**MCU**, tambur içindeki nem sensörlerinden (iletkenlik) çamaşırın kuruluk seviyesini sürekli izler."
    ],
    module_map: [
      { moduleId: "M3", role: "Kompresör ve Tambur Motoru" },
      { moduleId: "M6", role: "Nem Sensörü (İletkenlik), NTC" },
      { moduleId: "M1", role: "Kart Besleme" }
    ],
    topologies_used: ["Inverter (Isı pompalı)", "Röle (Klasik)"],
    typical_components: ["Kompresör", "Nem Sensör Plakaları", "Su Pompası"],
    typical_ic_families: ["MCU with ADC"],
    failure_scenarios: [
      {
        title: "Kurutma performansı düşük",
        symptoms: ["Çamaşırlar nemli çıkıyor", "Süre çok uzuyor"],
        likely_modules: ["M6", "M3"],
        likely_components: ["Tiftik filtresi", "Nem sensörü kirliliği"],
        notes: "Sensör yüzeyi deterjan/yumuşatıcı artığı ile kaplanırsa iletkenlik ölçümü hatalı olur."
      }
    ],
    learning_notes: {
      what_to_learn: ["İletkenlik prensibi ile nem ölçümü (Galvanik korozyon etkisi).", "Isı pompası termodinamiği (R134a/R290 gaz döngüsü).", "NTC sensör sapmalarının kurutma süresine etkisi."],
      common_misconceptions: ["Isıtmıyor gazı bitti (Genelde filtre tıkalıdır ve hava sirkülasyonu olmadığı için kompresör termiği atıyordur).", "Su haznesi boş ama 'Dolu' uyarısı veriyor (Pompa şamandırası takılı kalmış olabilir)."],
      practical_insights: ["Kondenser petekleri tiftikle dolarsa ısı transferi durur, makine kurutmaz.", "Kompresör kalkış kapasitörü (Inverter olmayan modellerde) değer kaybederse kompresör inler ve kalkamaz."]
    },
    safety_notes: ["Tiftik birikimi rezistanslı modellerde yangın riski oluşturur."]
  },
  {
    id: "elektrikli_dis_fircasi",
    name: "Elektrikli Diş Fırçası",
    category: "Temizlik ve Banyo Grubu",
    tags: ["kablosuz şarj", "motor", "batarya"],
    // Image: Toothbrush head close up
    imageUrl: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800",
    overview: "Bu cihazlar, tamamen izole (su geçirmez) bir gövde içinde kablosuz şarj alıcısı, Li-Ion pil ve eksantrik ağırlıklı bir motor barındırır.",
    working_principle: [
      "Şarj standındaki bobin, 50-100kHz frekansında manyetik alan yayar.",
      "Fırça gövdesindeki alıcı bobin bu alanı elektriğe çevirir (**İndüktif Şarj**).",
      "**BMS** devresi Li-Ion pili şarj eder.",
      "Kullanıcı düğmeye bastığında, H-Köprüsü motoru yüksek hızda sürer.",
      "Motor milindeki eksantrik ağırlık, gövdede güçlü titreşim oluşturarak fırçalama sağlar."
    ],
    module_map: [
      { moduleId: "M1", role: "Kablosuz Şarj Alıcı Bobini" },
      { moduleId: "M1", role: "Batarya ve BMS" },
      { moduleId: "M3", role: "DC Motor Sürücü" }
    ],
    topologies_used: ["Wireless Power Transfer", "H-Bridge"],
    typical_components: ["Bakır Bobin", "Li-Ion Pil (14500)", "DC Motor"],
    typical_ic_families: ["-"],
    failure_scenarios: [
      {
        title: "Şarj olmuyor",
        symptoms: ["Standına koyunca ışık yanmıyor"],
        likely_modules: ["M1"],
        likely_components: ["Pil ömrü", "Bobin lehim çatlağı"],
        notes: "Cihaz yere düştüğünde ağır olan bobin veya pil, lehim noktalarını çatlatabilir."
      }
    ],
    learning_notes: {
      what_to_learn: ["İndüktif kuplaj ve rezonans frekansı eşleşmesi.", "Eksantrik kütle ile titreşim oluşturma (ERM) fiziği.", "H-Köprüsü ile frenleme yaparak mod değiştirme."],
      common_misconceptions: ["Pili değiştirilmez (Değiştirilebilir ama lehim gerektirir ve su geçirmezlik bozulabilir).", "Şarj standı bozuk (Standlar çok basit yapılardır, genelde arıza fırçanın içindedir)."],
      practical_insights: ["Üst kısımdaki conta zamanla diş macunu asidinden bozulur ve içeri su alarak kartı oksitler.", "Titreşim zayıfladıysa motor değil, motor miline bağlı plastik aktarma organı kırılmış olabilir."]
    },
    safety_notes: ["Pil delinirse tehlikelidir."]
  },
  {
    id: "sac_duzlestirici",
    name: "Saç Düzleştirici",
    category: "Temizlik ve Banyo Grubu",
    tags: ["ptc", "rezistans", "kişisel bakım"],
    // Image: Heating plates close up
    imageUrl: "https://images.unsplash.com/photo-1560936353-c4547900f68d?auto=format&fit=crop&q=80&w=800",
    overview: "Saç düzleştiriciler, plakaları çok hızlı ısıtan ve sıcaklığı sabit tutan PTC (Pozitif Sıcaklık Katsayılı) termistör teknolojisini veya seramik rezistansları kullanır.",
    working_principle: [
      "Fiş takılıp açıldığında, **Triac** üzerinden ısıtıcı elemanlara akım gönderilir.",
      "**PTC** elemanları, soğukken düşük dirence sahiptir ve hızlıca yüksek akım çekerek ısınır.",
      "Isındıkça PTC'nin direnci artar ve akım otomatik olarak azalır (Kendinden regülasyon).",
      "Gelişmiş modellerde **NTC** sensörü sıcaklığı ölçer ve **MCU**, Triac'ı PWM ile sürerek sıcaklığı 180°C-230°C arasında sabit tutar.",
      "Otomatik kapanma özelliği, belirli bir süre hareket algılanmazsa güvenliği sağlar."
    ],
    module_map: [
      { moduleId: "M4", role: "Isıtıcı Kontrol (Triac)" },
      { moduleId: "M1", role: "Kapasitif Besleme (Logic için)" },
      { moduleId: "M6", role: "NTC Sıcaklık Sensörü" }
    ],
    topologies_used: ["PTC Heating", "Phase Control"],
    typical_components: ["PTC Isıtıcı", "Triac", "NTC (Cam Boncuk)"],
    typical_ic_families: ["-"],
    failure_scenarios: [
      {
        title: "Isınmıyor",
        symptoms: ["Işık yanıyor ama plakalar soğuk"],
        likely_modules: ["M4"],
        likely_components: ["Kablo döner mafsalı", "Rezistans kopuğu"],
        notes: "360 derece dönen kablo bağlantı noktaları en zayıf halkadır, içten kopar."
      }
    ],
    learning_notes: {
      what_to_learn: ["PTC malzemenin direnç-sıcaklık (R-T) eğrisi ve Curie noktası.", "Döner mafsal (Slip-ring) mekaniğindeki karbon/bakır aşınması.", "Triac tetikleme (Zero-crossing) yöntemleri."],
      common_misconceptions: ["Rezistans yandı (Genelde kablo veya termal sigorta arızalıdır).", "Isı ayarı bozuk (NTC sensörü plaka yüzeyinden ayrılmışsa doğru ölçemez)."],
      practical_insights: ["NTC sensörü plakalara termal macunla yapışıktır, cihaz yere düşerse bu temas kesilir ve aşırı ısınma meydana gelir.", "Kablo dibinden oynatıldığında cihaz gidip geliyorsa sorun %99 kablo kırığıdır."]
    },
    safety_notes: ["Yüksek ısı yanıkları ve kablo izolasyon hasarı riski."]
  },
  {
    id: "robot_supurge",
    name: "Robot Süpürge",
    category: "Temizlik ve Banyo Grubu",
    tags: ["pil", "sensör", "otonom"],
    // Image: Robot vacuum floor perspective
    imageUrl: "https://images.unsplash.com/photo-1563714272138-75b25ba5c436?auto=format&fit=crop&q=80&w=800",
    overview: "Robot süpürge, otonom navigasyon ve temizlik için çok sayıda sensör verisini işleyen mobil bir robotik sistemdir. SoC (System on Chip) tabanlı mimarisi ile bir akıllı telefona benzer.",
    working_principle: [
      "**LIDAR** kulesi dönerek lazer darbeleriyle odanın haritasını çıkarır (**SLAM**).",
      "Ana işlemci (**SoC**), bu harita üzerinde en verimli temizlik rotasını planlar.",
      "Tekerlek motorlarına gönderilen **PWM** sinyalleri ile robot hareket ettirilir; enkoderler gidilen mesafeyi doğrular.",
      "Alt kısımdaki fırçalar tozu merkeze toplar ve vakum motoru hazneye çeker.",
      "IR sensörler (Cliff sensors), merdiven boşluklarını algılayarak düşmeyi engeller.",
      "Batarya azaldığında, **BMS** uyarı verir ve robot IR sinyallerini izleyerek şarj istasyonuna döner."
    ],
    module_map: [
      { moduleId: "M7", role: "SoC, SLAM, Wi-Fi" },
      { moduleId: "M3", role: "Tekerlek ve Fırça Motorları" },
      { moduleId: "M6", role: "LIDAR, Cliff sensor, Bumper" },
      { moduleId: "M1", role: "BMS ve Şarj (Dock)" }
    ],
    topologies_used: ["H-Bridge (DC Motor)", "Buck Converter", "Li-Ion BMS"],
    typical_components: ["Li-Ion Pil Paketi", "DC Motorlar", "IR Sensörler"],
    typical_ic_families: ["STM32", "Allwinner/Rockchip SoC"],
    failure_scenarios: [
      {
        title: "Navigasyon hatası",
        symptoms: ["Kendi etrafında dönüyor", "Duvarlara çarpıyor"],
        likely_modules: ["M6", "M3"],
        likely_components: ["Tekerlek Enkoderi", "Tampon Sensörü", "LIDAR Motoru"],
        notes: "LIDAR başlığı dönmüyorsa (kayış kopuksa) robot kör olur."
      }
    ],
    learning_notes: {
      what_to_learn: ["Odometri hesabı (Tekerlek enkoderi 'tick' sayısı).", "LIDAR üçgenleme (Triangulation) mantığı.", "BMS hücre dengeleme sorunları."],
      common_misconceptions: ["Lazer bozuk (Genelde lazer ünitesini döndüren küçük motorun lastik kayışı kopmuştur veya motor sıkışmıştır).", "Robot şarj olmuyor (Şarj kontakları oksitlenmiş olabilir)."],
      practical_insights: ["Siyah halıları uçurum (cliff) zannedip üzerine çıkmayabilir, çünkü siyah yüzey IR ışığını emer.", "Yan fırça motorları saç dolanması yüzünden aşırı akım çekerse MOSFET sürücü yanabilir."]
    },
    safety_notes: ["Li-Ion piller delinirse yangın riski oluşturur."]
  },

  // --- SALON VE EĞLENCE SİSTEMLERİ ---
  {
    id: "televizyon",
    name: "LED TV",
    category: "Salon ve Eğlence Sistemleri",
    tags: ["görüntü", "backlight", "power"],
    // Image: TV circuit board (T-Con or Mainboard)
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    overview: "LED TV, yüksek hızlı dijital sinyal işleme ile hassas analog güç yönetimini birleştiren bir görüntüleme sistemidir. Donanım genellikle iki ana karta ayrılır: PSU ve Mainboard.",
    working_principle: [
      "PSU Kartı, 220V girişini **PFC** ve **LLC Resonant** devreleri ile 12V (Anakart) ve 100V+ (LED) gerilimlerine dönüştürür.",
      "Anakart üzerindeki **SoC**, HDMI veya Tuner girişinden gelen video sinyalini işler (Decode & Scale).",
      "İşlenen veri, **LVDS** veya V-by-One kablosu ile **T-CON** kartına iletilir.",
      "**T-CON**, görüntü karesini panelin satır ve sütun sürücülerine (Source/Gate Drivers) dağıtır.",
      "Eş zamanlı olarak PSU üzerindeki **LED Driver**, arka aydınlatma LED'lerini sabit akımla sürer.",
      "Sıvı kristaller, T-CON sinyallerine göre açılarak arka ışığı geçirir ve görüntüyü oluşturur."
    ],
    module_map: [
      { moduleId: "M0", role: "Giriş" },
      { moduleId: "M1", role: "Standby ve Ana Voltajlar (12V/24V)" },
      { moduleId: "M2", role: "PFC (Büyük ekranlarda)" },
      { moduleId: "M6", role: "LED Backlight Driver (Boost)" },
      { moduleId: "M7", role: "Mainboard (Görüntü/Ses)" }
    ],
    topologies_used: ["LLC Resonant (PSU)", "Boost Converter (LED Driver)"],
    typical_components: ["MOSFET", "Schottky", "LED Barları", "LVDS kablosu"],
    typical_ic_families: ["Backlight driver ICs"],
    failure_scenarios: [
      {
        title: "Görüntü yok (Ses var)",
        symptoms: ["Ekran karanlık", "Fener tutunca hayalet görüntü var"],
        likely_modules: ["M6"],
        likely_components: ["LED barları", "Backlight sürücü MOSFET"],
        notes: "Seri bağlı LED'lerden biri açık devre olursa tüm aydınlatma söner."
      }
    ],
    learning_notes: {
      what_to_learn: ["Sabit Akım (Constant Current) LED sürücü topolojileri ve OVP/OCP korumaları.", "PWM karartma (Dimming) frekansı ve titreme (Flicker) ilişkisi.", "T-CON kartındaki DC-DC dönüştürücüler (VGH, VGL voltajları)."],
      common_misconceptions: ["Panel kırık sandım (Backlight arızası çok yaygındır ve tamiri mümkündür, fener testi ile anlaşılır).", "Ekran morardı (LED fosforları bozulmuştur, LED bar değişimi gerekir)."],
      practical_insights: ["Backlight voltajı modeline göre 50V ile 200V arasında değişebilir, ölçerken dikkat.", "LED'lerin aşırı ısınmasını önlemek için arka ışığı %100 yerine %80 seviyesinde kullanmak ömrü ikiye katlar."]
    },
    safety_notes: ["PSU kartında yüksek voltaj kapasitörleri bulunur, dikkat."]
  },
  {
    id: "oyun_konsolu",
    name: "Oyun Konsolu",
    category: "Salon ve Eğlence Sistemleri",
    tags: ["cpu", "gpu", "yüksek performans"],
    // Image: Computer processor close up
    imageUrl: "https://images.unsplash.com/photo-1593152167544-085d3f9c4938?auto=format&fit=crop&q=80&w=800",
    overview: "Oyun konsolu, termal ve güç limitleri zorlanarak optimize edilmiş, özelleştirilmiş bir bilgisayar mimarisidir (SoC). Tasarım, yüksek performanslı grafik işleme ve hızlı veri aktarımı üzerine kuruludur.",
    working_principle: [
      "Cihaz açıldığında **PSU**, sisteme 12V DC sağlar.",
      "Anakart üzerindeki **VRM** (Buck Dönüştürücüler), APU (CPU+GPU) ve RAM için gereken düşük voltajları üretir.",
      "Sistem boot eder; **SSD** üzerinden oyun verileri GDDR6 belleğe yüklenir.",
      "Oyun sırasında APU yoğun işlem yapar ve ısınır.",
      "Sıcaklık sensörleri **MCU**'ya veri gönderir; **PWM** fan kontrolcüsü fan hızını artırarak soğutmayı sağlar."
    ],
    module_map: [
      { moduleId: "M1", role: "Dahili PSU (12V High Current)" },
      { moduleId: "M7", role: "Mainboard (APU, RAM, SSD)" },
      { moduleId: "M6", role: "Fan Kontrol, Sıcaklık Sensörleri" }
    ],
    topologies_used: ["LLC Resonant (PSU)", "Multiphase Buck (VRM)"],
    typical_components: ["APU", "GDDR6 RAM", "DrMOS (VRM)", "Sıvı Metal"],
    typical_ic_families: ["AMD Custom SoC", "HDMI Retimer"],
    failure_scenarios: [
      {
        title: "Açılıp kapanıyor (BLOD/WLOD)",
        symptoms: ["Işık yanıp sönüyor, görüntü gelmiyor"],
        likely_modules: ["M7"],
        likely_components: ["APU lehim çatlağı", "SSD kontrolcü", "HDMI entegresi"],
        notes: "Isınma-soğuma döngüleri BGA lehim toplarını çatlatabilir."
      }
    ],
    learning_notes: {
      what_to_learn: ["Çok fazlı voltaj regülasyonu (VRM) ve DrMOS verimlilik eğrileri.", "Load-line calibration mantığı.", "GDDR6 bellek eğitimi (Memory Training) ve arıza belirtileri."],
      common_misconceptions: ["Macunu değiştirince düzelir (Bazen sıvı metal sızmış ve kısa devre yapmış olabilir).", "Görüntü gelmiyorsa kesin HDMI portu bozuktur (HDMI Encoder entegresi veya APU da olabilir)."],
      practical_insights: ["HDMI portu fiziksel hasarı çok yaygındır, portun içindeki pinlerin eğilip eğilmediğine bakın.", "Sıvı metal soğutma kullanılan modellerde dikey kullanım zamanla sıvı metalin aşağı akmasına (pool effect) ve hotspot oluşmasına neden olabilir."]
    },
    safety_notes: ["PSU kapasitörleri söküldükten sonra bile doludur."]
  },
  {
    id: "modem",
    name: "Modem / Router",
    category: "Salon ve Eğlence Sistemleri",
    tags: ["rf", "network", "adaptör"],
    // Image: Circuit board with antennas
    imageUrl: "https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?auto=format&fit=crop&q=80&w=800",
    overview: "Modem/Router, yüksek frekanslı sinyal işleme (RF) ve ağ paket yönlendirme işlemlerini gerçekleştiren bir iletişim cihazıdır.",
    working_principle: [
      "Adaptörden gelen 12V DC, **Buck Converter**'lar ile 5V, 3.3V ve 1.2V'a düşürülür.",
      "**xDSL** veya **Fiber** hattından gelen analog sinyal, dijital paketlere çevrilir.",
      "**SoC**, veri paketlerinin yönlendirileceği hedefi (Ethernet veya Wi-Fi) belirler.",
      "Wi-Fi çipi, dijital veriyi **RF** sinyaline modüle eder.",
      "Güç Amplifikatörleri (**PA**), sinyali güçlendirerek antenlerden yayınlar."
    ],
    module_map: [
      { moduleId: "M1", role: "Harici Adaptör (12V)" },
      { moduleId: "M7", role: "SoC, Wi-Fi Chip, Switch" },
      { moduleId: "M1", role: "Dahili DC-DC (3.3V, 1.2V)" }
    ],
    topologies_used: ["Buck Converter"],
    typical_components: ["Broadcom/Qualcomm SoC", "RF Amplifier", "Ethernet Trafo"],
    typical_ic_families: ["DC-DC Regulators"],
    failure_scenarios: [
      {
        title: "Güç ışığı yanmıyor",
        symptoms: ["Cihaz ölü"],
        likely_modules: ["M1"],
        likely_components: ["Adaptör", "Giriş kapasitörü"],
        notes: "Genelde modem değil, 12V adaptörü bozulur."
      },
      {
        title: "Wi-Fi kopuyor / Zayıf",
        symptoms: ["Sinyal var ama internet yok", "Mesafe düştü"],
        likely_modules: ["M7"],
        likely_components: ["RF Power Amplifier (PA)", "Anten kablosu"],
        notes: "Aşırı ısınma RF güç amplifikatörlerinin performansını düşürür."
      }
    ],
    learning_notes: {
      what_to_learn: ["RF sinyal zinciri ve PA (Power Amplifier) lineerliği.", "Ethernet manyetiklerinin (Isolation transformer) gürültü engelleme rolü.", "Buck converter anahtarlama gürültüsünün SNR değerine etkisi."],
      common_misconceptions: ["Reset atınca her şey düzelir (Flash bellek bozulmuşsa veya adaptör voltajı dalgalıysa düzelmez).", "Anten sayısı arttıkça çekim gücü artar (MIMO teknolojisi hız içindir, menzil her zaman artmayabilir)."],
      practical_insights: ["Adaptör voltajı ölçü aletinde 12V görünse bile, osiloskopta bakıldığında aşırı Ripple varsa modem sürekli reset atar.", "Cihazın içindeki elektrolitik kondansatörler 7/24 sıcakta çalıştığı için çabuk kurur (ESR artar)."]
    },
    safety_notes: ["RF çıkışları insan sağlığı limitleri dahilindedir."]
  },

  // --- ÇALIŞMA ODASI VE KİŞİSEL CİHAZLAR ---
  {
    id: "pc_kasa",
    name: "Masaüstü Bilgisayar (PC)",
    category: "Çalışma Odası ve Kişisel Cihazlar",
    tags: ["atx", "smps", "anakart"],
    // Image: Motherboard VRM
    imageUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800",
    overview: "Masaüstü bilgisayar, modüler bir güç dağıtım ağı ve yüksek hızlı veri yolları üzerine kurulu bir sistemdir. ATX standardı, güç ve sinyalizasyon altyapısını tanımlar.",
    working_principle: [
      "Fiş takıldığında **PSU**, anakarta +5V Standby (**5VSB**) voltajını gönderir; sistem beklemededir.",
      "Güç düğmesine basıldığında anakart, **PS_ON** pinini toprağa çekerek PSU'yu uyandırır.",
      "PSU tüm ana voltaj raylarını (+12V, +5V, +3.3V) stabilize eder ve **Power Good** sinyalini gönderir.",
      "**Power Good** sinyalini alan **CPU**, Reset konumundan çıkar ve BIOS'tan ilk komutları okur (POST).",
      "Anakart üzerindeki **VRM** devreleri, 12V'u CPU'nun ihtiyaç duyduğu hassas çekirdek voltajına (Vcore) düşürür.",
      "İşletim sistemi yüklendikten sonra **CPU**, güç yönetimini devralarak yük durumuna göre voltaj ve frekansı dinamik olarak ayarlar."
    ],
    module_map: [
      { moduleId: "M1", role: "ATX PSU (12V, 5V, 3.3V)" },
      { moduleId: "M2", role: "Active PFC (PSU içinde)" },
      { moduleId: "M7", role: "Anakart (CPU, RAM)" },
      { moduleId: "M1", role: "VRM (CPU Beslemesi)" }
    ],
    topologies_used: ["Forward / LLC Converter", "Multiphase Buck"],
    typical_components: ["Super I/O", "MOSFET", "Capacitor", "PCH (Chipset)"],
    typical_ic_families: ["PWM Controllers"],
    failure_scenarios: [
      {
        title: "Tetik almıyor",
        symptoms: ["Fanlar dönmüyor, hiç tepki yok"],
        likely_modules: ["M1", "M7"],
        likely_components: ["PSU 5VSB hattı", "Anakart Start butonu/pinleri"],
        notes: "PSU'nun yeşil ve siyah kablosunu kısa devre yaparak PSU'nun tek başına çalışıp çalışmadığı test edilebilir."
      }
    ],
    learning_notes: {
      what_to_learn: ["ATX güç sıralaması (Power Sequencing: SLP_S3, SLP_S4 sinyalleri).", "VRM MOSFET'lerin RDS(on) direnci ve anahtarlama kayıpları.", "Super I/O çipinin başlatma sürecindeki rolü."],
      common_misconceptions: ["Fan dönüyorsa güç kaynağı sağlamdır (Voltajlar eksik veya Power Good sinyali gelmiyor olabilir).", "PC açılmıyorsa sorun kesin anakarttır (RAM temasızlığı veya PSU arızası daha yaygındır)."],
      practical_insights: ["Anakart üzerindeki debug LED'leri (CPU, RAM, VGA) arıza tespiti için ilk bakılacak yerdir.", "BIOS pili (CR2032) bitikse bazı eski anakartlar hiç tetik almaz."]
    },
    safety_notes: ["PSU kutusunu açmak tehlikelidir, büyük kapasitörler şok riski taşır."]
  },
  {
    id: "lcd_monitor",
    name: "LCD Monitör",
    category: "Çalışma Odası ve Kişisel Cihazlar",
    tags: ["ekran", "inverter", "görüntü"],
    // Image: Circuit board macro
    imageUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800",
    overview: "Monitörler, dijital görüntü sinyalini (HDMI/DP) işleyip LCD panel için uygun formata (LVDS/eDP) çeviren bir ana kart ve arka ışığı süren bir güç kartından oluşur.",
    working_principle: [
      "Adaptörden veya dahili PSU'dan gelen 12V/19V, sistem voltajlarına (5V, 3.3V) dönüştürülür.",
      "**Scaler Entegresi**, PC'den gelen dijital görüntüyü (Frame) panel çözünürlüğüne ölçekler.",
      "**Backlight Sürücü**, panelin arkasındaki LED şeritleri sabit akımla sürerek ışık sağlar.",
      "LCD panel, T-CON kartı üzerinden gelen sinyallerle pikselleri açıp kapatarak ışığı renkli görüntüye çevirir."
    ],
    module_map: [
      { moduleId: "M1", role: "PSU / Adaptör" },
      { moduleId: "M6", role: "LED Backlight Sürücü" },
      { moduleId: "M7", role: "Mainboard (Scaler)" }
    ],
    topologies_used: ["Boost Converter (LED)", "Buck Converter (Logic)"],
    typical_components: ["Scaler IC", "MOSFET", "Elektrolitik Kapasitör"],
    typical_ic_families: ["Novatek/Realtek Scaler"],
    failure_scenarios: [
      {
        title: "2 Saniye sonra görüntü gidiyor",
        symptoms: ["Logo görünüyor sonra kararıyor, ışık yeşil"],
        likely_modules: ["M6"],
        likely_components: ["Backlight LED", "İnverter Trafosu"],
        notes: "Sürücü devresi, LED'lerden biri bozuksa veya aşırı akım çekerse korumaya geçer ve ışığı keser."
      }
    ],
    learning_notes: {
      what_to_learn: ["LVDS ve eDP sinyal yapıları.", "EDID (Extended Display Identification Data) ve I2C iletişimi.", "Eski CCFL monitörlerde inverter trafosu arızaları."],
      common_misconceptions: ["Ekran bozuk (Genelde sadece arka aydınlatma bozuktur, panel sağlamdır).", "Görüntü gelmiyorsa kablo bozuktur (Kablo sağlamsa Scaler çipi arızalı olabilir)."],
      practical_insights: ["Fener tutarak 'hayalet görüntü' kontrolü yapmak, backlight arızasını hemen tespit ettirir.", "Dahili PSU'lu modellerde sekonder taraftaki kapasitörler şişmişse voltaj dengesizleşir ve görüntü titrer."]
    },
    safety_notes: ["Dahili PSU varsa kapasitörlerde yüksek voltaj bulunur."]
  },
  {
    id: "tablet",
    name: "Tablet Bilgisayar",
    category: "Çalışma Odası ve Kişisel Cihazlar",
    tags: ["dokunmatik", "batarya", "mobil"],
    // Image: Tablet repair/internals
    imageUrl: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=80&w=800",
    overview: "Tabletler, yüksek entegrasyonlu tek bir ana kart (Logic Board) üzerinde işlemci, bellek ve güç yönetimini barındırır. Ekran ve dokunmatik panel, cihazın ana arayüzüdür.",
    working_principle: [
      "Güç tuşuna basıldığında **PMIC** (Güç Yönetim Entegresi), bataryadan aldığı voltajı işlemci ve çevre birimlere dağıtır.",
      "**SoC** uyanır ve flash bellekten işletim sistemini (Android/iOS) RAM'e yükler.",
      "Kapasitif dokunmatik panel, parmak temasını X-Y koordinatları olarak algılar ve işlemciye iletir.",
      "Ekran sürücüsü (Display Driver), **MIPI** arayüzü üzerinden gelen veriyi piksellere dönüştürür.",
      "Şarj sırasında PMIC, batarya sıcaklığını ve voltajını sürekli izleyerek (CC/CV) şarjı yönetir."
    ],
    module_map: [
      { moduleId: "M7", role: "SoC, RAM, Storage" },
      { moduleId: "M1", role: "PMIC (Power Management IC)" },
      { moduleId: "M6", role: "Touch Screen Controller, Sensors" }
    ],
    topologies_used: ["Buck-Boost Converter", "LDO Regulation"],
    typical_components: ["PMIC", "Li-Po Batarya", "FPC Konnektörler"],
    typical_ic_families: ["Qualcomm/MediaTek PMIC"],
    failure_scenarios: [
      {
        title: "Şarj olmuyor",
        symptoms: ["Batarya simgesi çıkmıyor, akım çekmiyor"],
        likely_modules: ["M1"],
        likely_components: ["Şarj soketi (USB-C)", "PMIC"],
        notes: "Şarj soketindeki veri pinleri koparsa cihaz 'yavaş şarj' moduna düşer veya hiç şarj olmaz."
      }
    ],
    learning_notes: {
      what_to_learn: ["PMIC güç sıralaması (Power Sequencing).", "MIPI DSI ekran protokolü.", "USB-C PD (Power Delivery) müzakeresi ve CC pinleri."],
      common_misconceptions: ["Ekran kırık ama dokunmatik çalışıyor (Panel ve cam ayrı katmanlardır, bazen sadece cam kırılır).", "Şarj olmuyor pil bozuk (Şarj entegresi veya kablo sorunu daha olasıdır)."],
      practical_insights: ["Batarya şişmesi ekranı kasadan dışarı itebilir, bu durumda bataryayı delmemeye çok dikkat edin.", "FPC konnektörleri çok hassastır, takarken pimleri eğmemeye özen gösterin."]
    },
    safety_notes: ["Delinen Li-Po batarya anında alev alır."]
  },
  {
    id: "akilli_saat",
    name: "Akıllı Saat / Bileklik",
    category: "Çalışma Odası ve Kişisel Cihazlar",
    tags: ["giyilebilir", "sensör", "minyatür"],
    // Image: Internal mechanism of watch
    imageUrl: "https://images.unsplash.com/photo-1517502474097-f9b30659dadb?auto=format&fit=crop&q=80&w=800",
    overview: "Akıllı saatler, ekstrem minyatürizasyon örneğidir. Çok küçük bir alanda işlemci, ekran, batarya ve biyometrik sensörleri (PPG) barındırır.",
    working_principle: [
      "Alt kısımdaki **PPG Sensörü**, yeşil LED ışığını deriye gönderir ve yansıyan ışığı fotodiyot ile ölçerek nabzı hesaplar.",
      "İvmeölçer ve Jiroskop, kol hareketlerini (adım, uyku, jest) algılar.",
      "**Bluetooth SoC**, verileri telefona senkronize eder.",
      "Ekran (AMOLED), sadece bakıldığında (kol kaldırıldığında) açılarak enerji tasarrufu sağlar.",
      "Kablosuz şarj bobini, manyetik indüksiyon ile bataryayı doldurur."
    ],
    module_map: [
      { moduleId: "M7", role: "SiP (System in Package)" },
      { moduleId: "M6", role: "PPG Sensör, İvmeölçer" },
      { moduleId: "M1", role: "Kablosuz Şarj Alıcısı" }
    ],
    topologies_used: ["Wireless Power Transfer (Qi)", "LDO"],
    typical_components: ["SiP", "AMOLED Ekran", "Lipo Pil (küçük)"],
    typical_ic_families: ["Nordic nRF", "Dialog PMIC"],
    failure_scenarios: [
      {
        title: "Sensör ışığı yanmıyor",
        symptoms: ["Nabız ölçmüyor"],
        likely_modules: ["M6"],
        likely_components: ["Sensör camı kirliliği", "Arka kapak hasarı"],
        notes: "Su geçirmeme contası bozulursa ter buharı içeri girip sensörü oksitler."
      }
    ],
    learning_notes: {
      what_to_learn: ["Fotopletismografi (PPG) sinyal gürültü oranı (SNR).", "SiP (System in Package) termal limitleri.", "İvmeölçer ile 'uyandırma' (Wake on Raise) algoritmaları."],
      common_misconceptions: ["Su geçirmez (Aslında sadece suya dayanıklıdır, sıcak su ve sabun contaları zamanla bozar).", "Ekran yanığı (AMOLED ekranlarda statik görüntüler piksel yaşlanmasına neden olur)."],
      practical_insights: ["Ekran yapıştırıcısı sıcak havalarda veya pil şiştiğinde atabilir.", "Kablosuz şarj standına tam oturmazsa verim düşer ve cihaz ısınır."]
    },
    safety_notes: ["Cilde temas eden batarya aşırı ısınırsa yanık oluşturur."]
  },

  // --- İKLİMLENDİRME VE AYDINLATMA ---
  {
    id: "klima",
    name: "Klima (Split / Inverter)",
    category: "İklimlendirme ve Aydınlatma",
    tags: ["soğutma", "ısıtma", "dış ünite", "haberleşme"],
    // Image: Outdoor unit fan close up
    imageUrl: "https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?auto=format&fit=crop&q=80&w=800",
    overview: "Inverter klima, kompresör hızını değiştirerek ortam sıcaklığını hassas bir şekilde kontrol eden split bir sistemdir. İç ve dış ünite arasında güç ve veri hattı bulunur.",
    working_principle: [
      "Kullanıcı iç üniteyi açar ve sıcaklığı ayarlar; İç ünite sensörleri farkı hesaplar.",
      "Veri hattı üzerinden dış üniteye 'Soğutma Talebi' gönderilir.",
      "Dış ünite kartı, **PFC** devresini aktif eder ve **IPM** üzerinden kompresörü yumuşak (Soft Start) başlatır.",
      "Oda sıcaklığı hedefe yaklaştıkça kompresör devri düşürülür (Modülasyon).",
      "Isıtma modunda, **4-Yollu Vana** gazın akış yönünü tersine çevirir."
    ],
    module_map: [
      { moduleId: "M2", role: "Aktif PFC (Dış ünite)" },
      { moduleId: "M3", role: "Kompresör ve Fan Sürücü" },
      { moduleId: "M1", role: "SMPS (İç ve Dış)" },
      { moduleId: "M7", role: "Seri Haberleşme Loop" }
    ],
    topologies_used: ["Boost PFC", "3-Faz FOC", "Flyback"],
    typical_components: ["IPM", "PFC Bobini", "Reaktör", "4-yollu vana bobini"],
    typical_ic_families: ["TI C2000", "Opto-isolators for comms"],
    failure_scenarios: [
      {
        title: "Haberleşme Hatası",
        symptoms: ["İç/Dış ünite görüşmüyor", "Timer LED yanıp sönüyor"],
        likely_modules: ["M7"],
        likely_components: ["Optocoupler", "Sinyal hattı kabloları"],
        notes: "Sinyal hattı genelde 'S' klemensidir, nötr referanslı data taşır."
      }
    ],
    learning_notes: {
      what_to_learn: ["Elektronik Genleşme Valfi (EEV) step motor kontrolü.", "NTC sensör (Basma, Emme, Ortam) direnç eğrileri.", "Seri haberleşme protokolü (Start biti, parite) ve opto-izolasyon."],
      common_misconceptions: ["Gaz eksikliği her zaman soğutmama sebebidir (Sensör hatası veya dış ünite kart arızası da olabilir).", "Dış ünite fanı dönmüyorsa bozuktur (Bazen basınç dengelendiği için durması normaldir)."],
      practical_insights: ["Dış ünite kartında silikon kaplama (conformal coating) vardır, ölçüm yapmak için verniği kazımak gerekebilir.", "Kertenkele veya böcekler sıcak olduğu için dış ünite kartının arkasına girip kısa devre yaptırabilir."]
    },
    safety_notes: ["DC Bus 380V seviyesindedir."]
  },
  {
    id: "kombi",
    name: "Kombi (Yoğuşmalı)",
    category: "İklimlendirme ve Aydınlatma",
    tags: ["gaz", "su", "ateşleme", "güvenlik"],
    // Image: Industrial pipes/gauges
    imageUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800",
    overview: "Kombi, gaz yanmasını elektronik olarak modüle eden ve güvenliği en üst düzeyde tutan bir ısıtma cihazıdır. Yanma verimini artırmak için fan hızı ve gaz valfi senkronize çalışır.",
    working_principle: [
      "Isı isteği geldiğinde **Sirkülasyon Pompası** çalışır.",
      "**Fan** devreye girer; prosestat, atık gaz yolunun açık olduğunu doğrular.",
      "**Ateşleme Trafosu** elektrotlara yüksek voltaj vererek kıvılcım oluşturur.",
      "**Gaz Valfi** açılır ve yanma başlar.",
      "İyonizasyon elektrodu, alevin varlığını (mikroamper akım) **MCU**'ya bildirir.",
      "**MCU**, çıkış suyu sıcaklığını (**NTC**) izleyerek alev boyutunu (Gaz+Fan) modüle eder."
    ],
    module_map: [
      { moduleId: "M1", role: "SMPS (24V)" },
      { moduleId: "M6", role: "Gaz Valfi, Fan, Pompa, NTC, İyonizasyon" },
      { moduleId: "M7", role: "Ekran ve Mantık" }
    ],
    topologies_used: ["PWM Fan Control", "Ignition Transformer Driver"],
    typical_components: ["Ateşleme Trafosu", "İyonizasyon Elektrodu", "Step Motor (Gaz valfi)"],
    typical_ic_families: ["Safety critical MCUs"],
    failure_scenarios: [
      {
        title: "Alev Yok / Ateşleme Başarısız",
        symptoms: ["Çıt çıt sesi var alev yok", "Gaz kokusu yok"],
        likely_modules: ["M6"],
        likely_components: ["Gaz valfi bobini", "Ateşleme trafosu", "Röle"],
        notes: "İyonizasyon elektrodu kirlenirse alev olsa bile sistem algılayamaz ve kapatır."
      }
    ],
    learning_notes: {
      what_to_learn: ["Alev iyonizasyonu (Flame rectification) prensibi ve mikroamper seviyesinde akım ölçümü.", "Gaz/Hava karışımında Venturi etkisi.", "Sirkülasyon pompası PWM kontrolü."],
      common_misconceptions: ["Kart arızası her zaman değişim gerektirir (Röleler veya besleme kondansatörleri onarılabilir).", "Su basıncı düşüyorsa genleşme tankı patlamıştır (Genelde sadece havası bitmiştir)."],
      practical_insights: ["Faz-Nötr ters bağlantısı bazı kombilerde alev hissetmemeye yol açar (İyonizasyon toprağa akar).", "3 yollu vana motoru bozulursa petekler ısınır ama musluktan sıcak su gelmez (veya tam tersi)."]
    },
    safety_notes: ["Gaz hattı müdahalesi yetkili personel gerektirir!"]
  },
  {
    id: "vantilator",
    name: "Vantilatör",
    category: "İklimlendirme ve Aydınlatma",
    tags: ["motor", "hava", "basit"],
    // Image: Fan blade/motor close up
    imageUrl: "https://images.unsplash.com/photo-1565128938229-436540c9462f?auto=format&fit=crop&q=80&w=800",
    overview: "Vantilatörler, genellikle asenkron motor teknolojisine dayanan basit ama etkili hava hareketlendiricilerdir. Hız kontrolü, motor sargıları üzerinden kademeli olarak yapılır.",
    working_principle: [
      "Kullanıcı mekanik anahtar ile hız kademesini (1-2-3) seçer.",
      "Akım, seçilen sargı ucu üzerinden motora ulaşır; sargı empedansı hızı belirler.",
      "**Kapasitör**, ana sargı ile yardımcı sargı arasında faz farkı (90 derece) yaratarak döner manyetik alan oluşturur.",
      "Rotor üzerindeki kısa devre çubukları indüklenir ve motor döner.",
      "Pervane, havayı eksenel olarak hızlandırır."
    ],
    module_map: [
      { moduleId: "M4", role: "Hız Anahtarı (Kondansatörlü hız kontrol)" },
      { moduleId: "M3", role: "AC Motor" }
    ],
    topologies_used: ["Capacitor Split Phase"],
    typical_components: ["Daimi Devre Kondansatörü", "AC Motor"],
    typical_ic_families: ["-"],
    failure_scenarios: [
      {
        title: "Yavaş dönüyor / İnliyor",
        symptoms: ["Pervane zor dönüyor"],
        likely_modules: ["M3"],
        likely_components: ["Motor yatakları (Burç)", "Kapasitör"],
        notes: "Kapasitör değer kaybederse motor kalkış yapamaz veya yavaş döner."
      }
    ],
    learning_notes: {
      what_to_learn: ["Gölge kutuplu (Shaded Pole) vs PSC (Permanent Split Capacitor) motor tork eğrileri.", "Hız kademelerinde sargı endüktans değişimi.", "Burç yağlama fiziği (Sinterlenmiş bronz)."],
      common_misconceptions: ["Motor yandı (Genelde sadece yağsız kalmıştır ve sıkışmıştır).", "Kapasitörü çıkarırsam daha hızlı döner (Kapasitör olmazsa motor hiç dönmez, sadece titrer)."],
      practical_insights: ["Mekanik sıkışma termik sigortayı attırabilir, bu sigorta genelde sargıların arasına gizlenmiştir.", "WD-40 geçici çözümdür, kalıcı tamir için makine yağı kullanılmalıdır."]
    },
    safety_notes: ["Dönen pervane tehlikesi."]
  },
  {
    id: "nemlendirici",
    name: "Ultrasonik Nemlendirici",
    category: "İklimlendirme ve Aydınlatma",
    tags: ["piezo", "ultrasonik", "buhar"],
    // Image: Mist and water vapor
    imageUrl: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&q=80&w=800",
    overview: "Bu cihazlar, suyu ısıtmadan soğuk buhar üretmek için yüksek frekanslı ses dalgalarını (Ultrasonik) kullanır.",
    working_principle: [
      "Tabandaki **Piezoelektrik Seramik Disk**, elektronik osilatör devresi tarafından 1.7 MHz veya 2.4 MHz frekansında titreştirilir.",
      "Bu çok hızlı mekanik titreşim, su yüzeyinde kavitasyon etkisi yaratarak su moleküllerini mikron boyutunda parçalar.",
      "Oluşan sis (soğuk buhar), küçük bir fan yardımıyla cihazdan dışarı üflenir.",
      "Şamandıra sensörü, su bittiğinde osilatörü durdurarak piezo diskin yanmasını önler."
    ],
    module_map: [
      { moduleId: "M1", role: "SMPS (24V/36V)" },
      { moduleId: "M6", role: "Piezo Sürücü ve Fan" },
      { moduleId: "M6", role: "Su Seviye Sensörü (Manyetik)" }
    ],
    topologies_used: ["Colpitts Oscillator", "Buck Converter"],
    typical_components: ["Piezo Disk (20mm)", "Transistör (BU406)", "Fan"],
    typical_ic_families: ["-"],
    failure_scenarios: [
      {
        title: "Buhar vermiyor",
        symptoms: ["Işık yanıyor, fan çalışıyor ama buhar yok"],
        likely_modules: ["M6"],
        likely_components: ["Piezo disk", "Osilatör transistörü"],
        notes: "Piezo disk kireçlenirse veya çatlarsa titreşim genliği düşer."
      }
    ],
    learning_notes: {
      what_to_learn: ["Piezoelektrik etki ve rezonans empedans değişimi.", "Colpitts osilatör devre analizi ve Class-C sürücü.", "Su iletkenliğinin (TDS) atomizasyona etkisi."],
      common_misconceptions: ["Isıtıcı bozuk (Ultrasonik cihazlarda ısıtıcı yoktur, buhar soğuktur).", "Sadece ses çıkarıyor (Transistör sağlam ama piezo disk çatlak olabilir)."],
      practical_insights: ["Piezo disk değişiminde frekans uyumu (1.7 MHz vs 2.4 MHz) hayati önem taşır.", "Manyetik şamandıra sensörünün içindeki mıknatıs paslanıp şişerse takılı kalır."]
    },
    safety_notes: ["Devre kartı su altındadır, contalar sızdırırsa kısa devre olur."]
  },
  {
    id: "led_ampul",
    name: "LED Ampul",
    category: "İklimlendirme ve Aydınlatma",
    tags: ["led", "driver", "aydinlatma"],
    // Image: LED bulb filament close up
    imageUrl: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=800",
    overview: "LED ampul, şebeke gerilimini LED'lerin ihtiyaç duyduğu sabit DC akıma dönüştüren minyatür bir güç kaynağı içerir. Verimlilik ve termal yönetim tasarımın merkezindedir.",
    working_principle: [
      "Şebekeden gelen 220V AC, köprü diyot ile doğrultulur.",
      "**LED Sürücü Entegresi**, çıkış akımını sürekli izler (Sense Direnci).",
      "Entegre, dahili veya harici bir MOSFET'i yüksek frekansta anahtarlayarak (**Buck**) akımı sabit tutar.",
      "Seri bağlı LED dizisi (String) ışık yayar.",
      "Oluşan ısı, metal tabanlı PCB (MCPCB) ve gövde üzerinden atılır."
    ],
    module_map: [
      { moduleId: "M0", role: "Giriş (Köprü Diyot)" },
      { moduleId: "M6", role: "LED Sürücü (Constant Current)" },
      { moduleId: "M6", role: "LED Dizisi (PCB)" }
    ],
    topologies_used: ["Non-isolated Buck", "Linear Regulator (DOB)"],
    typical_components: ["BP28xx Driver IC", "SMD LED (2835)", "Elektrolitik Kapasitör"],
    typical_ic_families: ["Bright Power Semiconductor"],
    failure_scenarios: [
      {
        title: "Yanmıyor / Pırpır yapıyor",
        symptoms: ["Işık yok veya flaş yapıyor"],
        likely_modules: ["M6"],
        likely_components: ["LED çipi", "Sürücü entegresi"],
        notes: "Seri bağlı LED'lerden biri patlarsa devre tamamlanmaz. Pırpır yapıyorsa kondansatör şişmiştir."
      }
    ],
    learning_notes: {
      what_to_learn: ["Sabit akım (Constant Current) sürüş tekniği ve akım sınırlama direnci hesabı.", "LED'lerde 'Droop' etkisi ve sıcaklık-ömür ilişkisi (Arrhenius denklemi).", "Lineer vs SMPS sürücü verimlilik farkları."],
      common_misconceptions: ["Ampul patladı (Aslında sadece içindeki 1 tane küçük LED yandı, kısa devre edilirse geri kalanlar çalışır).", "Watt değeri parlaklığı gösterir (Lümen değeri daha doğrudur, verimlilik değişkendir)."],
      practical_insights: ["Soğutma yetersizse LED ömrü çok kısalır, kapalı armatürlerde LED kullanmak ömrü azaltır.", "Giriş katındaki MOV (Varistör) ani voltaj darbelerinde (yıldırım vb.) kendini feda ederek devreyi korur."]
    },
    safety_notes: ["Çoğu LED ampul izole değildir (Non-isolated), devreye dokunmak çarpar."]
  },

  // --- DİĞER EV ALETLERİ ---
  {
    id: "utu",
    name: "Buharlı Ütü",
    category: "Diğer Ev Aletleri",
    tags: ["ısı", "buhar", "mekanik"],
    // Image: Heating element or soleplate internals
    imageUrl: "https://images.unsplash.com/photo-1542360292-1dc3728bd296?auto=format&fit=crop&q=80&w=800",
    overview: "Ütü, elektrik enerjisini ısı ve buhara dönüştüren, ağırlıklı olarak mekanik kontrol elemanlarına dayanan bir cihazdır. 'Akıllı' modellerde ise elektronik sensörler işin içine girer.",
    working_principle: [
      "Kullanıcı fişi takar ve termostatı ayarlar.",
      "Rezistans ısınır ve tabanı ısıtır.",
      "Taban sıcaklığı ayarlanan değere gelince termostat devreyi keser.",
      "Su haznesinden damlatılan su, sıcak tabanda anında buharlaşır.",
      "Elektronik modellerde hareket sensörü, ütü hareketsiz kaldığında güvenliği sağlamak için gücü keser."
    ],
    module_map: [
      { moduleId: "M4", role: "Isıtıcı Kontrol" },
      { moduleId: "M6", role: "Hareket Sensörü (Auto-off)" },
      { moduleId: "M1", role: "Besleme (Akıllı modellerde)" }
    ],
    topologies_used: ["Röle/Triac Switch"],
    typical_components: ["Termostat (Bimetal)", "Termik Sigorta", "Hareket bilyası"],
    typical_ic_families: ["-"],
    failure_scenarios: [
      {
        title: "Isınmıyor",
        symptoms: ["Işık yanmıyor", "Taban soğuk"],
        likely_modules: ["M4"],
        likely_components: ["Termik sigorta", "Kablo kopuğu (sap kısmında)"],
        notes: "Ütü kabloları sürekli hareketten dolayı içten kopar."
      }
    ],
    learning_notes: {
      what_to_learn: ["Mekanik histeresis ve termal genleşme.", "Buhar odası termodinamiği ve Leidenfrost etkisinin önlenmesi.", "Bilyalı hareket sensörü mekaniği."],
      common_misconceptions: ["Elektronik bozuk (Çoğu ütü hala tamamen mekaniktir).", "Su akıtıyor conta bozuk (Taban yeterince ısınmadan buhar düğmesine basılırsa su buharlaşamadan akar)."],
      practical_insights: ["Termik sigorta atıksa, termostatın yapışıp yapışmadığı kontrol edilmelidir yoksa yeni sigorta da atar.", "Tabandaki kireçlenme ısı transferini bozar ve rezistansın aşırı ısınmasına neden olur."]
    },
    safety_notes: ["Yüksek ısı yanıkları."]
  },
  {
    id: "akilli_priz",
    name: "Akıllı Priz",
    category: "Diğer Ev Aletleri",
    tags: ["iot", "röle", "wifi"],
    // Image: Smart plug disassembled showing relay and PCB
    imageUrl: "https://images.unsplash.com/photo-1558002038-1091a1661116?auto=format&fit=crop&q=80&w=800",
    overview: "Akıllı priz, klasik bir röle anahtarlama devresini Wi-Fi mikrodenetleyicisi ile birleştiren temel bir IoT (Nesnelerin İnterneti) cihazıdır. Enerji ölçümü yapabilen modeller de mevcuttur.",
    working_principle: [
      "Şebeke gerilimi, kompakt bir **SMPS** ile 5V/3.3V'a düşürülerek kontrol devresini besler.",
      "Kullanıcı telefondan 'Aç' komutu gönderdiğinde, **Wi-Fi SoC** (ESP8266 vb.) bunu alır.",
      "SoC, bir transistör aracılığıyla **Röle** bobinini enerjilendirir.",
      "Röle kontağı kapanır ve elektriği priz çıkışına iletir.",
      "Enerji ölçüm çipi (varsa), akım şöntü üzerindeki gerilim düşümünü okuyarak harcamayı hesaplar."
    ],
    module_map: [
      { moduleId: "M1", role: "Mini SMPS (Non-isolated)" },
      { moduleId: "M7", role: "Wi-Fi SoC (ESP8266/ESP32)" },
      { moduleId: "M4", role: "Güç Rölesi" }
    ],
    topologies_used: ["Buck Converter", "Low Side Switching"],
    typical_components: ["Röle (16A)", "ESP8266 Modül", "AMS1117 LDO"],
    typical_ic_families: ["BL0937 (Enerji Ölçüm)"],
    failure_scenarios: [
      {
        title: "Tık sesi geliyor ama açılmıyor",
        symptoms: ["Röle sesi var, çıkışta elektrik yok"],
        likely_modules: ["M4"],
        likely_components: ["Röle kontağı"],
        notes: "Yüksek akımlı yükler (ısıtıcı vb.) röle kontaklarını zamanla yakar veya yapıştırır."
      },
      {
        title: "Wi-Fi bağlanmıyor",
        symptoms: ["LED hızlı yanıp sönüyor"],
        likely_modules: ["M1"],
        likely_components: ["Besleme kapasitörü", "Wi-Fi modülü"],
        notes: "Kalitesiz besleme kapasitörleri zamanla değer kaybeder, modül reset atar."
      }
    ],
    learning_notes: {
      what_to_learn: ["IoT röle kontrolü ve Flyback diyotunun önemi.", "Sıfır geçiş (Zero-crossing) anahtarlamanın kontak ömrüne etkisi.", "Şönt direnç veya Akım Trafosu ile güç ölçümü."],
      common_misconceptions: ["İçinde küçük bir motor var (Röle manyetik çalışır, motor yoktur).", "5GHz Wi-Fi destekler (Çoğu IoT çipi maliyet nedeniyle sadece 2.4GHz destekler)."],
      practical_insights: ["Röle yapışırsa cihaz sürekli açık kalır, güvenlik riski oluşturur.", "Wi-Fi anteni PCB üzerinde çizilmiş bir yoldur, metal kutu içine konursa çekmez."]
    },
    safety_notes: ["İç devre şebeke ile izole değildir, karta dokunmak çarpar."]
  },
  {
    id: "guvenlik_kamerasi",
    name: "IP Güvenlik Kamerası",
    category: "Diğer Ev Aletleri",
    tags: ["görüntü", "ağ", "kızılötesi"],
    // Image: Camera lens sensor and chip macro
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
    overview: "IP kameralar, görüntüyü dijital veriye çevirip ağ üzerinden ileten gömülü sistemlerdir. Gece görüşü için IR LED'ler ve mekanik IR-Cut filtresi kullanırlar.",
    working_principle: [
      "Objektiften gelen ışık, **CMOS Sensör** üzerine düşer ve dijital sinyale çevrilir.",
      "**ISP** (Image Signal Processor), ham veriyi işler (renk, parlaklık).",
      "**SoC**, görüntüyü sıkıştırır (H.264/H.265) ve Wi-Fi/Ethernet üzerinden gönderir.",
      "Hava karardığında fotodirenç (LDR) bunu algılar; **IR LED**'leri yakar ve **IR-Cut** filtresini mekanik olarak lensin önünden çeker.",
      "Mikrofon ve hoparlör, çift yönlü ses iletimi sağlar."
    ],
    module_map: [
      { moduleId: "M7", role: "SoC ve Wi-Fi" },
      { moduleId: "M6", role: "CMOS Sensör ve IR-Cut Bobini" },
      { moduleId: "M1", role: "Besleme (12V/5V)" }
    ],
    topologies_used: ["Buck Converter", "Image Processing"],
    typical_components: ["CMOS Sensör", "IR LED", "IR-Cut Filtresi", "Wi-Fi Anten"],
    typical_ic_families: ["HiSilicon / Sony CMOS"],
    failure_scenarios: [
      {
        title: "Görüntü pembeleşti",
        symptoms: ["Gündüz renkler yanlış (pembe/mor tonlu)"],
        likely_modules: ["M6"],
        likely_components: ["IR-Cut Filtresi"],
        notes: "Mekanik IR-Cut filtresi takılı kalırsa gündüz vakti kızılötesi ışık sensöre ulaşır ve renkleri bozar."
      }
    ],
    learning_notes: {
      what_to_learn: ["CMOS görüntü sensörü yapısı ve Bayer filtresi.", "Video sıkıştırma (H.264/H.265) ve bant genişliği.", "IR-Cut filtresi için H-Köprüsü sürücü mantığı.", "PoE (Power over Ethernet) 802.3af standardı."],
      common_misconceptions: ["Lens bozuk (Genelde sorun IR filtresi mekaniğindedir).", "Kamera 'hacklendi' (Genelde varsayılan şifre değiştirilmemiştir)."],
      practical_insights: ["IR LED'ler gece çalışırken hafif kırmızı parlar, bu çalıştığını gösterir.", "Besleme kablosu çok uzunsa voltaj düşümü olur ve gece IR LED'ler açılınca kamera kapanıp açılır."]
    },
    safety_notes: ["Mahremiyet ve ağ güvenliği (varsayılan şifreleri değiştirin)."]
  }
];

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "SMPS",
    definition: "Switched Mode Power Supply. Anahtarlamalı güç kaynağı. Yüksek frekansta anahtarlama yaparak voltajı dönüştürür, verimlidir ve hafiftir.",
    related_ids: ["M1"]
  },
  {
    term: "PFC",
    definition: "Power Factor Correction (Güç Faktörü Düzeltme). Şebekeden çekilen akımın voltajla aynı fazda olmasını sağlayarak verimliliği artırır.",
    related_ids: ["M2"]
  },
  {
    term: "Inverter",
    definition: "DC gerilimi istenen frekans ve genlikte AC gerilime dönüştüren güç elektroniği devresi. Motor hız kontrolünde temeldir.",
    related_ids: ["M3", "buzdolabi", "camasir_makinesi"]
  },
  {
    term: "BLDC",
    definition: "Brushless DC Motor (Fırçasız Doğru Akım Motoru). Komütasyonun elektronik olarak yapıldığı, yüksek verimli ve uzun ömürlü motor tipi.",
    related_ids: ["M3"]
  },
  {
    term: "Triac",
    definition: "AC akımı her iki yönde de iletebilen ve kontrol edilebilen yarı iletken anahtar. Dimmer ve ısıtıcı kontrolünde kullanılır.",
    related_ids: ["M4"]
  },
  {
    term: "NTC",
    definition: "Negative Temperature Coefficient. Sıcaklık arttıkça direnci azalan termistör. Sıcaklık ölçümü ve ani akım (inrush) korumasında kullanılır.",
    related_ids: ["M0", "M6"]
  },
  {
    term: "EMI",
    definition: "Electromagnetic Interference (Elektromanyetik Girişim). Cihazların yaydığı veya etkilendiği gürültü sinyalleri.",
    related_ids: ["M0"]
  },
  {
    term: "IPM",
    definition: "Intelligent Power Module. IGBT/MOSFET'ler, sürücüler ve koruma devrelerinin tek bir paket içinde birleştirildiği modül.",
    related_ids: ["M3"]
  },
  {
    term: "FOC",
    definition: "Field Oriented Control (Vektör Kontrolü). Motorun manyetik alanını ve torkunu birbirinden bağımsız kontrol ederek yüksek verim sağlayan algoritma.",
    related_ids: ["M3"]
  },
  {
    term: "HV",
    definition: "High Voltage (Yüksek Gerilim). Ev elektroniğinde genelde şebeke voltajı üzeri veya mikrodalga/TV gibi cihazlardaki kV seviyesini ifade eder.",
    related_ids: ["mikrodalga", "yazici"]
  },
  {
    term: "VRM",
    definition: "Voltage Regulator Module. İşlemci gibi hassas yükler için çok kararlı ve düşük voltaj (örn: 1.2V) sağlayan güç katı.",
    related_ids: ["pc_kasa", "oyun_konsolu"]
  },
  {
    term: "MCU",
    definition: "Microcontroller Unit (Mikrodenetleyici). Cihazın beyni olan, programlanabilir entegre devre.",
    related_ids: ["M7"]
  },
  {
    term: "PWM",
    definition: "Pulse Width Modulation (Darbe Genişlik Modülasyonu). Sinyalin açık kalma süresini değiştirerek ortalama gücü kontrol etme tekniği.",
    related_ids: ["M1", "M3"]
  },
  {
    term: "IGBT",
    definition: "Insulated Gate Bipolar Transistor. Yüksek voltaj ve akımları anahtarlamak için kullanılan güçlü yarı iletken.",
    related_ids: ["M3", "M5"]
  },
  {
    term: "LLC Resonant",
    definition: "Yüksek verimlilik sağlayan, yumuşak anahtarlama (Soft Switching) yapabilen gelişmiş bir güç kaynağı topolojisi.",
    related_ids: ["M1"]
  },
  {
    term: "BMS",
    definition: "Battery Management System. Batarya hücrelerini izleyen, dengeleyen ve koruyan elektronik devre.",
    related_ids: ["robot_supurge", "sarjli_supurge"]
  },
  {
    term: "SLAM",
    definition: "Simultaneous Localization and Mapping. Robotun bilmediği bir ortamda harita oluştururken aynı anda konumunu belirlemesi.",
    related_ids: ["robot_supurge"]
  },
  {
    term: "Eddy Akımları",
    definition: "Değişken manyetik alana maruz kalan iletkenlerde indüklenen dairesel elektrik akımları. İndüksiyon ocaklarında ısıtma prensibi olarak kullanılır.",
    related_ids: ["induksiyon_ocak"]
  },
  {
    term: "SoC",
    definition: "System on Chip. İşlemci, bellek ve çevre birimlerinin tek bir çip üzerinde toplandığı entegre devre.",
    related_ids: ["M7", "robot_supurge", "televizyon"]
  },
  {
    term: "Buck Converter",
    definition: "DC voltajı daha düşük bir DC voltaj seviyesine yüksek verimle düşüren anahtarlamalı güç kaynağı topolojisi.",
    related_ids: ["M1", "M7"]
  },
  {
    term: "SiP",
    definition: "System in Package. Birden fazla entegre devrenin tek bir paket içinde birleştirilmesi (Örn: Apple Watch işlemcisi).",
    related_ids: ["akilli_saat"]
  },
  {
    term: "PTC",
    definition: "Positive Temperature Coefficient. Isındıkça direnci artan bileşen. Isıtıcılarda otomatik sıcaklık kontrolü için kullanılır.",
    related_ids: ["sac_duzlestirici", "camasir_makinesi"]
  },
  {
    term: "MIPI",
    definition: "Mobile Industry Processor Interface. Mobil cihazlarda ekran ve kamera gibi bileşenlerin işlemciyle haberleşme standardı.",
    related_ids: ["tablet", "akilli_saat"]
  },
  {
    term: "PMIC",
    definition: "Power Management IC. Mobil cihazlarda batarya şarjı ve voltaj dağıtımını yöneten entegre.",
    related_ids: ["tablet", "akilli_saat"]
  },
  {
    term: "Termoblok",
    definition: "Kahve makinelerinde suyu anında ısıtmak için kullanılan, içinde su kanalları bulunan alüminyum döküm ısıtıcı blok.",
    related_ids: ["espresso_makinesi"]
  },
  {
    term: "Peltier",
    definition: "Termoelektrik soğutucu. Elektrik akımı uygulandığında bir yüzeyi soğuyan diğer yüzeyi ısınan yarı iletken plaka.",
    related_ids: ["su_sebili"]
  },
  {
    term: "IR-Cut",
    definition: "Kızılötesi Kesici Filtre. Kameralarda gündüz renklerin doğru görünmesi için IR ışığı engelleyen, gece ise mekanik olarak açılan filtre.",
    related_ids: ["guvenlik_kamerasi"]
  }
];