import { v4 as uuidv4 } from 'uuid';
import { StableBTreeMap, ic, int8 } from 'azle';
import express from "express";

/**
 * `userStorage` - it's a key-value datastructure that is used to store users.
 * {@Link StableBTreeMap} is a self-balancing tree that acts as a durable data storage that keeps data accross canister upgrades.
 * For the sake of this contract we've choses to use {@Link StableBTreeMap} as a storage for the next reasons:
 * - `insert`, `get` and `remove` operations have a constant time complexity - O(1)
 * - data stored in the map survives canisters upgrades unlike using HashMap where data is stored in the heap and it's lost after the canister is upgraded
 *
 * Brakedown of the `StableBTreeMap(string, User)` datastructure:
 * - the key of map is an `userId`
 * - the value in this map is an user itself `User` that is related to a given key (`userIf`)
 *
 * Constructor values:
 * 1) 0 - memory id where to initialize a map
 */

/**
 * This type represents an User
 */
class User {
    id:             string;
    pseudo:         string;
    description:    string;
    attachmentURL:  string;
    score:          int8;
    sendableScore:  int8;
    createdAt:      Date;
    updatecAt:      Date | null;
}

class UserPayload {
    pseudo:         string;
    description:    string;
    attachmentURL:  string | null;
    score:          int8;
    sendableScore:  int8;
}

const usersStorage = StableBTreeMap<string, User>(0);
let users = [];


export default Server(() => {
    const app = express();
    app.use(express.json());

    app.post("/users", (req, res) => {
        const user: User = {
            id: uuidv4(),
            createdAt: getCurrendDate(),
            ...req.body};
        usersStorage.insert(user.id, user);
        res.json(user);
    });

    app.get("/users", (req, res) => {
        res.json(usersStorage.values());
    })

    app.get("/users/:id", (req, res) => {
        const userId = req.params.id;
        const userOpt = usersStorage.get(userId);
        if ("None" in userOpt) {
            res.status(404).send(`User with id=${userId} not found`);
        } else {
            res.json(userOpt.Some);
        }
    });

    app.put("/users/:id", (req, res) => {
        const userId = req.params.id;
        const userOpt = usersStorage.get(userId);
        if ("None" in userOpt) {
            res.status(404).send(`User with id=${userId} not found.`);
        } else {
            const user = userOpt.Some;
            const updatedUser = {...user, ...req.body, updatedAt: getCurrendDate() };
            usersStorage.insert(userId, updatedUser);
            res.json(updatedUser);
        }
    });

    app.delete("/users/:id", (req, res) => {
        const userId = req.params.id;
        const deletedUser = usersStorage.remove(userId);
        if ("None" in deletedUser) {
            res.status(404).send(`User with id=${userId} not found`);
        } else {
            res.json(deletedUser.Some);
        }
    });

    return app.listen();

})



function getCurrendDate() {
    const timestamp = new Number(ic.time());
    return new Date(timestamp.valueOf() / 1000_000);
}