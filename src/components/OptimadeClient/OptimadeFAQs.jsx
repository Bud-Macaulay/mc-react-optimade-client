import { useState } from "react";
import { containerStyle } from "../../styles/containerStyles";

import { textNormal, textSmall, textHyperlink } from "../../styles/textStyles";

const sectionclassName = "space-y-2";

export default function OptimadeFAQs() {
  const [showMore, setShowMore] = useState(false);

  return (
    <div
      className={`${containerStyle} ${textSmall} [&>p]:pl-4 [&>section>p]:pl-1`}
    >
      <section className={sectionclassName}>
        <h4 className={textNormal}>What is the OPTIMADE Client?</h4>
        <p>
          This is a friendly client to search through databases and other
          implementations exposing an OPTIMADE RESTful API. To get more
          information about the OPTIMADE API, please see{" "}
          <a
            href="https://www.optimade.org/"
            target="_blank"
            className={textHyperlink}
            rel="noopener noreferrer"
          >
            the official web page
          </a>
          . All providers are retrieved from{" "}
          <a
            href="https://providers.optimade.org/"
            target="_blank"
            className={textHyperlink}
            rel="noopener noreferrer"
          >
            the OPTIMADE consortium's list of providers
          </a>
          .
        </p>

        <button
          className={`flex items-center px-2 mt-2 mb-1 ${textHyperlink} hover:cursor-pointer`}
          onClick={() => setShowMore(!showMore)}
        >
          <span className={textHyperlink}>
            {showMore ? "Hide additional Info" : "More info"}
          </span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              showMore ? "rotate-90" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </section>

      {showMore && (
        <section className={sectionclassName}>
          <h4 className={textNormal}>
            Why is a given provider not shown in the client?
          </h4>
          <p>
            This webapp has filtered some providers for various reasons; some do
            not support open queries and others have no link to a meta-database.
            To check the validity of a particular provider visit{" "}
            <a
              href="https://optimade.org/providers-dashboard/"
              target="_blank"
              className={textHyperlink}
              rel="noopener noreferrer"
            >
              the providers dashboard
            </a>
            . Querying of missing providers should still be possible through the
            'Custom endpoint' method.
          </p>

          <h4 className={textNormal}>
            Why does the structure visualiser not work for some structures?
          </h4>
          <p>
            The visualiser is fairly primitive and the OPTIMADE specification is
            very broad. For complex structure data (assemblies, unknown
            positions, or partial occupancies), the JSON response is still
            fetched but the visualisation often fails.
          </p>
        </section>
      )}
    </div>
  );
}
