import React from 'react';
import './Contact.css';

const Contact = () => {
    return (
        <div className="contact-container">
            <div className="contact-terms-content">
                <h1>Minimum Viable Product (MVP) Disclaimer</h1>
                <p><strong>Last Updated:</strong> [Insert Date]</p>

                <h2>1. Introduction</h2>
                <p>
                    The current version of our platform is a <strong>Minimum Viable Product (MVP)</strong>. An MVP is an early version of a product that is released with the core features to gather user feedback and validate the concept. While we are actively developing and improving the platform, please note the following:
                </p>

                <h2>2. Current State of Development</h2>
                <p>
                    We are currently in the development phase of this project. As such, the platform may experience issues, including but not limited to:
                </p>
                <ul>
                    <li><strong>Latency:</strong> You may experience delays or slow response times due to ongoing optimizations.</li>
                    <li><strong>Limited Functionality:</strong> Some features may not be fully implemented or may not work as intended.</li>
                    <li><strong>Bugs and Errors:</strong> The platform may contain bugs, errors, or unexpected behavior as we continue to refine the codebase.</li>
                    <li><strong>Downtime:</strong> The platform may be temporarily unavailable during maintenance or updates.</li>
                </ul>

                <h2>3. User Expectations</h2>
                <p>
                    By using this MVP, you acknowledge and agree that:
                </p>
                <ul>
                    <li>The platform is still under active development and is not yet a final product.</li>
                    <li>You may encounter issues that could affect your experience.</li>
                    <li>We are not liable for any inconvenience, loss, or damage caused by the use of this MVP.</li>
                </ul>

                <h2>4. Feedback and Support</h2>
                <p>
                    Your feedback is invaluable to us. If you encounter any issues or have suggestions for improvement, please reach out to us at the email provided below. We are committed to making continuous improvements and appreciate your patience and understanding as we work towards delivering a more robust and feature-rich version of our platform.
                </p>

                <h2>5. Contact Us</h2>
                <p>If you have any questions or concerns regarding this MVP, please contact us at:</p>
                <p className="contact-email">support@companymail.com</p>
            </div>
            <footer className="contact-footer">
                &copy; 2025 companymail.com. All rights reserved.
            </footer>
        </div>
    );
};

export default Contact;