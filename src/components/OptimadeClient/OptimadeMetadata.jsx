const containerStyle =
  "w-full p-2 border border-slate-500 rounded-sm bg-slate-50 shadow-sm";

const paragraphclassName = "text-sm px-1";
const headingclassName = "text-lg mb-1";

const hyperlinkclassName = "text-blue-500 hover:underline hover:text-blue-600";
const sectionclassName = "space-y-2";

export default function OptimadeMetadata({ child }) {
  if (!child) {
    return (
      <div className={containerStyle}>
        <h3 className={headingclassName}>FAQs</h3>

        <section className={sectionclassName}>
          <h4 className={headingclassName}>
            What is1232132 the OPTIMADE Client?
          </h4>
          <p className={paragraphclassName}>
            This is a friendly client to search through databases and other
            implementations exposing an OPTIMADE RESTful API. To get more
            information about the OPTIMADE API, please see{" "}
            <a
              href="https://www.optimade.org/"
              target="_blank"
              className={hyperlinkclassName}
              rel="noopener noreferrer"
            >
              the official web page
            </a>
            . All providers are retrieved from{" "}
            <a
              href="https://providers.optimade.org/"
              target="_blank"
              className={hyperlinkclassName}
              rel="noopener noreferrer"
            >
              the OPTIMADE consortium's list of providers
            </a>
            .
          </p>
          <p className={paragraphclassName}>
            To get started, select a provider and subdatabase and start
            exploring! This message will be hidden when exploring starts.
          </p>

          <h4 className={headingclassName}>
            Why is a given provider not shown in the client?
          </h4>
          <p className={paragraphclassName}>
            This webapp has filtered some providers for various reasons; some do
            not support open queries and others have no link to a meta-database.
            Querying should still be possible through the 'Custom endpoint'
            method.
          </p>

          <h4 className={headingclassName}>
            Why does the structure visualiser not work for some structures?
          </h4>
          <p className={paragraphclassName}>
            The visualiser is fairly primitive and the OPTIMADE specification is
            very broad. For complex structure data (assemblies, unknown
            positions, or partial occupancies), the JSON response is still
            fetched but the visualisation often fails.
          </p>
        </section>
      </div>
    );
  }

  const { name, description, ...otherAttrs } = child;

  return (
    <div className={containerStyle}>
      <h3 className={headingclassName}>{name}</h3>
      {description && <p className={paragraphclassName}>{description}</p>}
    </div>
  );
}
