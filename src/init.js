import "dotenv/config";
import app from "./server";



const PORT = 4000;

const handleListening = () => console.log(`Server on http://localhost:${PORT}`);

app.listen(PORT, handleListening);

app.on("error", () => console.log(error));