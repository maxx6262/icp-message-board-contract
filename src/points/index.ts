import { v4 as uuidv4 } from 'uuid';
import { Server, StableBTreeMap } from 'azle';
import express from 'xpress';

/**
 * Allocation is amount of points an user could allocate to another without any other use case for these points.
 *
 * `pointStorage` - it's a key-value datastructure that is used to store point allocations.
 * {@link StableBTreeMap} is a self-balancing tree that acts as a durable data storage that keeps data across canister upgrades.
 * For the sake of this contract we've chosen {@link StableBTreeMap} as a storage for the next reasons:
 * - `insert`, `get` and `remove` operations have a constant time complexity - O(1)
 * - data stored in the map survives canister upgrades unlike using HashMap where data is stored in the heap and it's lost after the canister is upgraded
 *
 * Brakedown of the `StableBTreeMap(string, Allocation)` datastructure:
 * - the key of map is a `allocationId
 * - the value in this map is an allocation itself `Allocation` that is related to a given key (`allocationId`)
 *
 * Constructor values:
 * 1) 0 - memory id where to initialize a map.
 */

/**
 * This type represents an allocation than can be listed on board
 */
class Allocation {
    id:         string;
    //sender:     string;
    recipient:  string;
    amount:     number;
    createdAt:  Date;
}

const allocationStorage = StableBTreeMap<string, Allocation>(0);

export default Server( () => {
    const app = express();
    app.use(express.json());

    app.post("/allocations", (req, res) => {
        const allocation: Allocation = {id: uuidv4(), }
    })
})