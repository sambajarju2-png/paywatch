import { siteConfig } from "@/lib/config";



export default function AboutPage() {

  return (

    <section className="py-16 px-6 bg-pw-bg min-h-screen">

      <div className="max-w-[800px] mx-auto">

        <span className="text-[12px] font-semibold text-pw-blue tracking-widest uppercase">Over ons</span>

        <h1 className="text-[40px] font-extrabold text-pw-navy mt-2 mb-5 tracking-tight leading-tight">

          Gebouwd uit frustratie.<br />Gedreven door empathie.

        </h1>

        <p className="text-[16px] text-pw-muted leading-[1.7] mb-10 max-w-[600px]">

          We zagen het om ons heen: mensen die niet snapten waarom een rekening van €50 opeens €200 was geworden. Het incassosysteem in Nederland is ingewikkeld, onpersoonlijk en duur. Dat moest anders.

        </p>



        {/* Founders */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

          {Object.values(siteConfig.founders).map((p) => (

            <div key={p.name} className="bg-white rounded-card p-7 border border-pw-border">

              <div className="w-14 h-14 rounded-2xl bg-pw-blue-light flex items-center justify-center mb-4">

                <span className="text-[24px] font-extrabold text-pw-navy">{p.name[0]}</span>

              </div>

              <h3 className="text-[18px] font-bold text-pw-navy">{p.name}</h3>

              <p className="text-[12px] font-semibold text-pw-blue mb-3">{p.role}</p>

              <p className="text-[14px] text-pw-muted leading-relaxed">{p.desc}</p>

            </div>

          ))}

        </div>



        {/* Mission */}

        <div className="bg-pw-blue-light rounded-card p-7 text-center border border-pw-blue/10">

          <p className="text-[20px] font-bold text-pw-navy italic">&ldquo;Gebouwd in Nederland, voor Nederland.&rdquo;</p>

        </div>



        {/* Story */}

        <div className="mt-12 space-y-4 text-[15px] text-pw-muted leading-[1.7]">

          <p>

            PayWatch begon als een frustratie-project. Samba kreeg zelf te maken met een rekening die was geëscaleerd naar een incassobureau — terwijl hij dacht dat alles betaald was. De kosten? Verdrievoudigd. De communicatie? Onbegrijpelijk.

          </p>

          <p>

            Samen met Mariama besloot hij dat er een betere manier moest zijn. Niet nóg een app die je schulden laat zien. Maar eentje die je helpt om te voorkomen dat het escalert. Die je waarschuwt. Die je uitleg geeft over je rechten. En die je verbindt met hulp als het nodig is.

          </p>

          <p>

            Vandaag helpt PayWatch mensen in 43+ gemeenten om grip te houden op hun rekeningen. Niet met angst, maar met overzicht. Niet met dreiging, maar met rust.

          </p>

        </div>

      </div>

    </section>

  );

}
