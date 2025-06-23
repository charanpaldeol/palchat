# HumaneStack - Digital Sovereignty Platform

A self-evolving, human-centric digital system for digital sovereignty advocacy. Technology that serves humanity, not profit.

## 🎯 Vision & Mission

**Vision**: To create a world where digital giants are collectively owned by the societies that power them, where value flows back to the people who generate it through their attention, creativity, and participation.

**Mission**: To provide an open, equitable platform that raises awareness about the intersection of technology, privacy, and power — while inspiring individuals to imagine and build alternatives to the status quo.

## 🏗️ Project Structure

```
palchat/
├── myastosite/          # Frontend (Astro + React)
├── backend/             # Backend (FastAPI)
├── core/               # System vision and manifest
└── assets/             # Static assets
```

## 🚀 Tech Stack

### Frontend
- **Astro** - Static Site Generator with SSR
- **React** - Interactive components
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **TypeScript** - Type safety

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Database ORM
- **Pydantic** - Data validation
- **SQLite** - Database (development)
- **Python-Jose** - JWT authentication

## 🌐 Deployment

### Production URLs
- **Frontend**: https://palchat.org (Vercel)
- **Backend**: Render Web Services
- **API Docs**: Available at backend URL + `/docs`

### Deployment Platforms
- **Frontend**: Vercel (Automatic deployment from main branch)
- **Backend**: Render (Web Services)
- **Domain**: palchat.org

📋 **Detailed deployment information**: See [DEPLOYMENT_INFO.md](DEPLOYMENT_INFO.md)

## 🛠️ Development

### Frontend Development
```bash
cd myastosite
npm install
npm run dev
```
Open [http://localhost:4321](http://localhost:4321)

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Open [http://localhost:8000](http://localhost:8000)

### Building for Production
```bash
# Frontend
cd myastosite
npm run build

# Backend
cd backend
# Deploy to Render
```

## 🎨 Features

- **Interactive AI System** - Privacy-first conversational AI
- **Mission Guardian** - AI safety and alignment validation
- **Community Governance** - Self-evolving system based on community consensus
- **Digital Sovereignty Education** - Resources and awareness building
- **Responsive Design** - Mobile-first, accessible design

## 🔒 Privacy & Security

- **Privacy by Design** - No tracking, no surveillance
- **Local Processing** - AI processing happens locally when possible
- **Encrypted Communication** - All data encrypted in transit
- **Consent-Based** - No data collection without explicit consent

## 📚 Documentation

- [System Vision Manifest](core/system_vision_manifest.md)
- [Deployment Information](DEPLOYMENT_INFO.md)
- [API Documentation](backend/README.md)

## 🤝 Contributing

This is a community-driven project focused on digital sovereignty. All contributions that align with our vision and values are welcome.

## 📄 License

See [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for a more humane digital future**
