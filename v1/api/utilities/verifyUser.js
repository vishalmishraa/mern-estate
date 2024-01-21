import  jwt  from "jsonwebtoken";
import { errorHandler } from "./error.js";
import cookies from "cookie-parser";


export const verifyToken = (req, res, next) => {
    console.log(req.cookies);
    const token = req.cookies.access_token;

    if (!token) {
        return next(errorHandler(401, 'Unauthorized'));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(errorHandler(403, 'Unauthorized'));
        }
        req.user = decoded;
        next();
    });

}