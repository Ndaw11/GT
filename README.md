# Cloner le projet
git clone https://github.com/Ndaw11/GT.git
cd GT

# Backend
cd taxes-backend
docker-compose up -d
npm install

# Front Web/Admin
cd ../taxes-admin
npm install
npm run dev

# Front Mobile
cd ../taxes-mobile
npm install
npx expo start
