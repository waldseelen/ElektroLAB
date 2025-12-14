import React from 'react';
import { Activity, BookOpen, Cpu, Layers, Target, ShieldCheck, HelpCircle } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      
      {/* Hero Section */}
      <section className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Hakkında & Metodoloji
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          ElektroLab, ev elektroniği sistemlerinin çalışma prensiplerini ve arıza dinamiklerini mühendislik perspektifiyle inceleyen açık kaynaklı bir eğitim platformudur.
        </p>
      </section>

      {/* Mission Grid */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <Target className="w-8 h-8 text-accent mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Amaç</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Karmaşık elektronik cihazları (Black Box) anlaşılabilir alt sistemlere (Gray Box) dönüştürmek. Ezbere dayalı tamir bilgisinden ziyade, analitik arıza tespit yeteneği kazandırmak.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <Layers className="w-8 h-8 text-accent mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Hedef Kitle</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Elektrik-Elektronik Mühendisliği öğrencileri, teknik servis personelleri ve ileri düzey hobi elektroniği ile ilgilenenler için akademik derinlikte pratik bilgiler sunar.
          </p>
        </div>
      </section>

      {/* Methodology */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
          <BookOpen className="w-6 h-6 mr-2 text-primary" />
          Eğitim Yaklaşımı
        </h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">1</div>
            <div>
              <h3 className="font-bold text-slate-800">Modüler Analiz</h3>
              <p className="text-slate-600 text-sm">Her cihaz M0'dan M7'ye kadar standartlaştırılmış modüller üzerinden incelenir.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-600">2</div>
            <div>
              <h3 className="font-bold text-slate-800">Topoloji Odaklılık</h3>
              <p className="text-slate-600 text-sm">Sadece "bozuk parça" değil, o parçanın içinde bulunduğu devre topolojisi (Flyback, Buck, Inverter vb.) öğretilir.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-600">3</div>
            <div>
              <h3 className="font-bold text-slate-800">Kök Neden Analizi</h3>
              <p className="text-slate-600 text-sm">Semptomlardan yola çıkarak arızanın fiziksel ve elektronik kök nedenine inilir.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-slate-100 p-6 rounded-xl border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-2 flex items-center">
          <ShieldCheck className="w-5 h-5 mr-2 text-slate-600" />
          Yasal Uyarı & Güvenlik
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Bu platformdaki bilgiler sadece eğitim amaçlıdır. Elektrikli cihazlara müdahale etmek ciddi yaralanma ve ölüm riski taşır. Şebeke gerilimi (220V/380V) ve yüksek voltaj kapasitörleri konusunda deneyimi olmayan kişiler cihazların içini açmamalıdır. İçerikteki olası hatalardan dolayı oluşabilecek hasarlardan platform sorumlu tutulamaz.
        </p>
      </section>

      <footer className="text-center text-slate-400 text-xs pt-8 border-t border-slate-200">
        <p>© 2024 ElektroLab Açık Kaynak Projesi. React & Tailwind ile geliştirilmiştir.</p>
      </footer>
    </div>
  );
};

export default About;