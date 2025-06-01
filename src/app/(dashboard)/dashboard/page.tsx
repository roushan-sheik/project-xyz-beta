import React from "react";

const Dashboard = () => {
  return (
    <div>
      <div className="max-w-4xl mx-auto p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Lorem Ipsum</h1>
          <p className="text-lg text-gray-600">
            Classic placeholder text with modern styling
          </p>
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          {/* First Section */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              What is Lorem Ipsum?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum. Sed ut perspiciatis
              unde omnis iste natus error sit voluptatem accusantium doloremque
              laudantium.
            </p>
          </section>

          {/* Second Section */}
          <section className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">
              Sample Paragraph
            </h2>
            <p className="text-blue-700 leading-relaxed mb-4">
              Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et
              quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
              ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
              sed quia consequuntur magni dolores eos qui ratione voluptatem
              sequi nesciunt.
            </p>
            <p className="text-blue-700 leading-relaxed">
              Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
              consectetur, adipisci velit, sed quia non numquam eius modi
              tempora incidunt ut labore et dolore magnam aliquam quaerat
              voluptatem.
            </p>
          </section>

          {/* Third Section with Cards */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Multiple Sections
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border">
                <h3 className="text-xl font-medium text-gray-800 mb-3">
                  Section One
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui
                  blanditiis praesentium voluptatum deleniti atque corrupti quos
                  dolores et quas molestias excepturi.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border">
                <h3 className="text-xl font-medium text-gray-800 mb-3">
                  Section Two
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Sint occaecati cupiditate non provident, similique sunt in
                  culpa qui officia deserunt mollitia animi, id est laborum et
                  dolorum fuga.
                </p>
              </div>
            </div>
          </section>

          {/* Quote Section */}
          <section className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-8 text-center">
            <blockquote className="text-xl italic text-gray-800 mb-4">
              ` Et harum quidem rerum facilis est et expedita distinctio. Nam
              libero tempore, cum soluta nobis est eligendi optio cumque nihil
              impedit quo minus.`
            </blockquote>
            <cite className="text-gray-600 font-medium">- Lorem Ipsum</cite>
          </section>

          {/* List Section */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Key Points
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">
                  Temporibus autem quibusdam et aut officiis debitis aut rerum
                  necessitatibus saepe eveniet
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">
                  Ut voluptates repudiandae sint et molestiae non recusandae
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">
                  Itaque earum rerum hic tenetur a sapiente delectus
                </span>
              </li>
            </ul>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            This is a sample layout using Lorem Ipsum text with Tailwind CSS
            styling.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
