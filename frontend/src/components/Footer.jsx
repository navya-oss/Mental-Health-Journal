function Footer() {
  return (
    <footer className="bg-neutral-800/90 backdrop-blur-md shadow-inner py-4 text-neutral-300">
      <div className="container mx-auto text-center">
        © {new Date().getFullYear()} MindJournal · Built with ❤️ for self-care
      </div>
    </footer>
  );
}

export default Footer;
