export default function ApplicationLogo({ alt = "Spra", ...props }) {
    return <img src="/upload/logo.svg" alt={alt} {...props} />;
}
