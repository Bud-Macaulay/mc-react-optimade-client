import { useState, useRef, useEffect } from "react";

// unused for now.
export default function OptimadeFAQs() {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [isOpen]);

  return (
    <div className="">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border-2 border-slate-300 bg-slate-200 py-3 px-4 rounded shadow flex justify-between hover:bg-slate-300 transition"
      >
        <span className="text-left flex-1">FA222Qs</span>
        <span className="ml-2">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Accordion Content */}
      <div
        ref={contentRef}
        style={{ maxHeight: height }}
        className="overflow-hidden transition-max-height duration-300 ease-in-out"
      >
        <div className="p-6 bg-white rounded shadow space-y-6">
          {/* FAQ Content */}
          <section className="space-y-2">
            <h4 className="font-bold text-lg">
              Why is a given provider not shown in the client?
            </h4>
            <p className="text-sm">
              The most likely reason is that they have not yet registered with{" "}
              <a
                href="https://github.com/Materials-Consortia/providers"
                target="_blank"
                className="text-blue-500 underline"
                rel="noopener noreferrer"
              >
                the OPTIMADE consortium's list of providers repository
              </a>
              . Please contact the given provider and let them know they can
              register themselves there.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-bold text-lg mt-6">
              Why is the provider I wish to use greyed out and disabled?
            </h4>
            <p className="text-sm">There may be different reasons:</p>
            <ul className="list-disc list-inside space-y-1 text-sm leading-relaxed">
              <li>
                The provider has not supplied a link to an OPTIMADE index
                meta-database.
              </li>
              <li>
                The provider has implemented an unsupported specification
                version.
              </li>
              <li>
                The provider has supplied a link that could not be reached.
              </li>
              <li>
                The provider claims to implement a supported specification
                version, but certain required features are not fully
                implemented.
              </li>
            </ul>
            <p className="text-sm leading-relaxed">
              Please go to{" "}
              <a
                href="https://github.com/Materials-Consortia/providers"
                target="_blank"
                className="text-blue-500 underline"
                rel="noopener noreferrer"
              >
                the OPTIMADE consortium's list of providers repository
              </a>{" "}
              to update the provider in question's details.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-bold text-lg mt-6">
              When I choose a provider, why can I not find any databases?
            </h4>
            <p className="text-sm">There may be different reasons:</p>
            <ul className="list-disc list-inside space-y-1 text-sm leading-relaxed">
              <li>
                The provider does not have a{" "}
                <code className="bg-gray-100 px-1 rounded">/structures</code>{" "}
                endpoint.
              </li>
              <li>The implementation is of an unsupported version.</li>
              <li>The implementation could not be reached.</li>
            </ul>
            <p className="text-sm leading-relaxed">
              An implementation may also be removed upon the user choosing it.
              This is due to OPTIMADE API version incompatibility between the
              implementation and this client.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-bold text-lg mt-6">
              I know a database hosts X number of structures, why can I only
              find Y?
            </h4>
            <p className="text-sm leading-relaxed">
              All searches (including the raw input search) will be
              pre-processed prior to sending the query. This is done to ensure
              the best experience when using the client. Specifically, all
              structures with{" "}
              <code className="bg-gray-100 px-1 rounded">"assemblies"</code> and{" "}
              <code className="bg-gray-100 px-1 rounded">
                "unknown_positions"
              </code>{" "}
              (for pre-v1 implementations) in the{" "}
              <code className="bg-gray-100 px-1 rounded">
                "structural_features"
              </code>{" "}
              property are excluded.
            </p>
            <p className="text-sm leading-relaxed">
              <code className="bg-gray-100 px-1 rounded">"assemblies"</code>{" "}
              handling will be implemented at a later time. See{" "}
              <a
                href="https://github.com/aiidalab/ipyoptimade/issues/12"
                target="_blank"
                className="text-blue-500 underline"
                rel="noopener noreferrer"
              >
                this issue
              </a>{" "}
              for more information.
            </p>
            <p className="text-sm leading-relaxed">
              Finally, a provider may choose to expose only a subset of their
              database.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-bold text-lg mt-6">
              Why are some downloadable formats greyed out and disabled for
              certain structures?
            </h4>
            <p className="text-sm leading-relaxed">
              Currently, only two libraries are used to transform the OPTIMADE
              structure into other known data types:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm leading-relaxed">
              <li>
                <a
                  href="https://github.com/Materials-Consortia/optimade-python-tools"
                  target="_blank"
                  className="text-blue-500 underline"
                  rel="noopener noreferrer"
                >
                  OPTIMADE Python Tools
                </a>{" "}
                library
              </li>
              <li>
                <a
                  href="https://wiki.fysik.dtu.dk/ase/index.html"
                  target="_blank"
                  className="text-blue-500 underline"
                  rel="noopener noreferrer"
                >
                  Atomistic Simulation Environment (ASE)
                </a>{" "}
                library
              </li>
            </ul>
            <p className="text-sm leading-relaxed">
              ASE does not support transforming structures with partial
              occupancies, hence the options using ASE will be disabled when
              such structures are chosen in the application. There are plans to
              also integrate{" "}
              <a
                href="https://pymatgen.org/"
                target="_blank"
                className="text-blue-500 underline"
                rel="noopener noreferrer"
              >
                pymatgen
              </a>
              , however, the exact integration is still under design.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
