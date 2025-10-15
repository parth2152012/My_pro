import { Link } from "react-router-dom";
import { FaFacebook, FaLinkedin, FaGithub, FaXTwitter, FaYoutube } from "react-icons/fa6";

export const Footer = () => {
    return (
        <section
            id="footer"
            className="w-full text-base-content text-left px-4 sm:px-6 md:px-10 lg:px-20 py-10 mt-20 border-t border-base-300"
        >
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Navigation */}
                    <div className="col-span-2">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            <div>
                                <h3 className="footer-title">Navigation</h3>
                                <ul className="list-none space-y-2 mt-4">
                                    <li><Link to="/#homeSection" className="link link-hover">Home</Link></li>
                                    <li><Link to="/aboutPage" className="link link-hover">About us</Link></li>
                                    <li><Link to="/contactPage" className="link link-hover">Contact us</Link></li>
                                    <li><Link to="/product" className="link link-hover">Product</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="footer-title">Resources</h3>
                                <ul className="list-none space-y-2 mt-4">
                                    <li><Link to="/T&D" className="link link-hover">Terms and Conditions</Link></li>
                                    <li><Link to="/caseStudies" className="link link-hover">Use Cases</Link></li>
                                    <li><Link to="/blog" className="link link-hover">Blog</Link></li>
                                    <li><Link to="/blog" className="link link-hover">Insight</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="footer-title">Contact</h3>
                        <div className="space-y-2 mt-4">
                            <p>(+66) 066 091 8408</p>
                            <p>info@comos.space</p>
                        </div>
                        <div className="flex flex-row gap-4 mt-4">
                            <FaFacebook size={20} className="cursor-pointer hover:text-primary" onClick={() => window.open("https://www.facebook.com/itkrakentec", "_blank")} />
                            <FaLinkedin size={20} className="cursor-pointer hover:text-primary" onClick={() => window.open("https://www.linkedin.com/company/103316266", "_blank")} />
                            <FaXTwitter size={20} className="cursor-pointer hover:text-primary" onClick={() => window.open("https://twitter.com/krakentec", "_blank")} />
                            <FaGithub size={20} className="cursor-pointer hover:text-primary" onClick={() => window.open("https://www.github.com/KRAKEN-TEC", "_blank")} />
                            <FaYoutube size={20} className="cursor-pointer hover:text-primary" onClick={() => window.open("https://www.youtube.com/@krakentec", "_blank")} />
                        </div>
                    </div>
                </div>
                <div className="mt-10 pt-8 border-t border-base-300 text-center md:text-left">
                    <p>© 2025 Comos. All rights reserved.</p>
                </div>
            </div>
        </section>
    );
};
