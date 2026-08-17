import { useEffect } from "react";
import "./styles.css";

const faqItems = [
  {
    question: "Wie starte ich die Konfiguration?",
    answer: "Klicken Sie auf „Konfiguration starten“ und folgen Sie dem klar strukturierten Workflow von Abmessungen über Dach und Öffnungen bis zur Zusammenfassung."
  },
  {
    question: "Kann ich eine Halle später speichern?",
    answer: "Ja. Über den Button „Gespeichert“ können Sie komplette Hallen-Varianten im Browser ablegen und später wieder öffnen."
  },
  {
    question: "Welche Öffnungstypen sind verfügbar?",
    answer: "Die Konfiguration unterstützt unter anderem Leeröffnungen, Türen, Rolltore, Lichtkuppeln und Photovoltaik-Elemente."
  },
  {
    question: "Was passiert nach der Planung?",
    answer: "Am Ende erhalten Sie eine Zusammenfassung Ihrer Auswahl, mit der Sie direkt zur Anfrage oder weiter zur Kontaktabwicklung gelangen."
  },
  {
    question: "Wie erhalte ich Unterstützung?",
    answer: "Bei offenen Fragen hilft Ihnen die Startseite und die Kontaktanfrage direkt weiter, damit Sie schnell und unkompliziert fortfahren können."
  }
];

export default function FAQPage({ setShowApp }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousOverflowX = document.body.style.overflowX;
    const previousOverflowY = document.body.style.overflowY;

    document.body.style.overflow = "auto";
    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = "auto";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overflowX = previousOverflowX;
      document.body.style.overflowY = previousOverflowY;
    };
  }, []);

  return (
    <div className="landingPage faqPage">
      <div className="landingAmbientOrbs" aria-hidden="true">
        <span className="landingOrb landingOrbOne" />
        <span className="landingOrb landingOrbTwo" />
      </div>

      <section className="landingStage faqStage">
        <p className="landingEyebrow">Support & Orientierung</p>
        <h1 className="landingTitle faqTitle">Häufig gestellte Fragen</h1>
        <p className="landingSubtitle faqSubtitle">
          Ein schneller Überblick zu Planung, Speicherung und den wichtigsten Schritten in der Hallenkonfiguration.
        </p>

        <div className="faqListScroll" role="list">
          <div className="faqGrid">
            {faqItems.map((item, index) => (
              <article className="faqCard" role="listitem" key={`${item.question}-${index}`}>
                <h2 className="faqQuestion">{item.question}</h2>
                <p className="faqAnswer">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="landingActions faqActions">
          <button className="button landingButton landingButtonSecondary" onClick={() => setShowApp("landing")}>
            Zur Startseite
          </button>
          <button className="button landingButton landingButtonPrimary" onClick={() => setShowApp("app")}>
            Konfiguration starten
          </button>
        </div>
      </section>
    </div>
  );
}
