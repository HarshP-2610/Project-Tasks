import { useState } from "react";
import Counter from "./Component/Counter";
import User from "./Component/User";
import AddUser from "./Component/AddUser";

function App() {
    // const [number, setNumber] = useState(0);

    return (
        <>
            {/* <Counter /> */}
            <User />
            <AddUser />
        </>
    );
}