Thực hiện vai trò người thứ 3 
Người 3 – Movie Service 
API:  
• GET /movies  
• POST /movies 
Yêu cầu: 
• Không cần event phức tạp  

Nhóm : Bảo, Sơn , Quyền, Quý, Liêm
# Movie Service (Node.js + Express)

Part of the Movie Ticket System (Event-Driven Architecture).

## Tech Stack
- Node.js + Express.js
- MariaDB / MySQL (mysql2)
- Architecture: Clean MVC

## API Endpoints
- `GET /movies`: List all movies.
- `POST /movies`: Add a new movie.
- `PUT /movies/:id`: Edit a movie.

## Installation & Running (MariaDB)
1. Configure database in `.env` file.
2. Install dependencies: `npm install`.
3. Run service: `npm run start`.

The service will run on port `8082`.

