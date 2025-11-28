export default function AdminFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <p className="text-sm text-gray-500">
                            © {currentYear} Smart Sprouts. All rights reserved.
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <p className="text-xs text-gray-400">
                            System Version 1.0.0
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}