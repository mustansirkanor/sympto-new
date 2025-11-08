export default function Footer() {
  return (
    <footer className="bg-card-bg border-t border-medical-blue/20 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-bold font-heading text-medical-blue mb-4">
              SymptoScan
            </h3>
            <p className="text-gray-400 text-sm">
              AI-powered medical diagnosis for better living.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold font-heading mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-medical-blue transition">Features</a></li>
              <li><a href="#" className="hover:text-medical-blue transition">Pricing</a></li>
              <li><a href="#" className="hover:text-medical-blue transition">Security</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold font-heading mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-medical-blue transition">About</a></li>
              <li><a href="#" className="hover:text-medical-blue transition">Blog</a></li>
              <li><a href="#" className="hover:text-medical-blue transition">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold font-heading mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-medical-blue transition">Privacy</a></li>
              <li><a href="#" className="hover:text-medical-blue transition">Terms</a></li>
              <li><a href="#" className="hover:text-medical-blue transition">Compliance</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-medical-blue/20 pt-8">
          <p className="text-center text-gray-400 text-sm">
            © 2025 SymptoScan. All rights reserved. Transforming healthcare with AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
