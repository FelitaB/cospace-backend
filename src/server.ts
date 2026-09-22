import express, { Request, Response} from "express";

const app = express();
const port = 5000;

app.get("/", (req: Request, res: Response) => {
	res.status(200).json({
		status: "active",
		message: "CoSpace API is running",
	});
});

app.listen(port);

export default app;