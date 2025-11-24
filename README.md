# TOON Converter

A modern, privacy-focused web application for converting between JSON, YAML, and TOON formats. TOON is a data serialization format optimized for LLM token efficiency.

## Features

- **Bidirectional Conversion**: Seamlessly convert between JSON, YAML, and TOON.
- **Token Optimization**: Real-time statistics showing input/output token counts and reduction percentage.
- **Privacy-First**: All conversions happen locally in your browser. No data is sent to any server.
- **Modern UI**: A sleek, responsive interface with glassmorphism design and dark mode.
- **Advanced Configuration**: Customize indentation, delimiters, key folding, and flattening depth.
- **Syntax Highlighting**: Integrated code editors with syntax highlighting for better readability.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Core Library**: [`@toon-format/toon`](https://www.npmjs.com/package/@toon-format/toon)

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/totoon.git
    cd totoon
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    bun install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    bun dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
