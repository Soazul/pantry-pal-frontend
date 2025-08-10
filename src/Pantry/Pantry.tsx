import { useDispatch, useSelector } from "react-redux";
import Header from "../Header/Header"
import Session from "../Login/Session"
import CreatePantry from "./CreatePantry";
import styles from "./Pantry.module.css";
import { BsPlusCircleFill } from 'react-icons/bs';
import { FaTrash, FaPencilAlt } from 'react-icons/fa';
import * as client from "./client";
import { setPantry, deletePantry } from "./reducer";
import { useEffect, useState } from "react";

export default function Pantry() {
    const unitDisplayNames: any = {
        GRAMS: "g",
        KILOGRAMS: "kg",
        LITERS: "L",
        MILLILITERS: "mL",
        CUPS: "c",
        TABLESPOONS: "tbsp",
        TEASPOONS: "tsp",
        PIECES: "pcs",
        OUNCES: "oz",
        POUNDS: "lbs"
    };

    const pantry = useSelector((state: any) => state.pantryItems.pantryItems);

    const dispatch = useDispatch();
    const fetchPantry = async () => {
        const data = await client.getPantry();
        dispatch(setPantry(data));
    };
    const removePantry = async (pantryId: any) => {
        await client.deletePantry(pantryId);
        dispatch(deletePantry(pantryId));
    };

  const [editingItem, setEditingItem] = useState(null);

    // Edit button handler
    const onEditClick = (item) => {
        setEditingItem(item);
    };

    useEffect(() => {
        fetchPantry();
    }, []);

    return (
        // <Session>
        <div>
        <Header/>
        <div className="container">
            <div className="row justify-content-between mt-5">
                <div className="col-6">
                    <input className={styles.searchbar} type="search" placeholder="Search"/>
                </div>

                <div className="col-6 d-flex justify-content-end align-items-center gap-4">
                <div className="dropdown">
                    <button type="button" className={`${styles.btn} dropdown-toggle`} data-bs-toggle="dropdown">Filter By</button>
                    <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">Option 1</a></li>
                    <li><a className="dropdown-item" href="#">Option 2</a></li>
                    </ul>
                </div>

                <ul className="pagination mb-0">
                    <li className="page-item">
                    <a className="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                    </li>
                    <li className="page-item"><a className="page-link" href="#">1</a></li>
                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                    <li className="page-item">
                    <a className="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                    </li>
                </ul>
                </div>
            </div>
            <br/>
            <table className="table table-striped">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Quantity</th>
                <th scope="col">Expiration Date</th>
                <th scope="col">Category</th>
                <th scope="col">Location</th>
                </tr>
            </thead>
            <tbody>
            {
            pantry.map((item: any) => (
                <tr key={item.id}>
                <th scope="row">{item.id}</th>
                <td>{item.name}</td>
                <td>{`${item.quantity} ${unitDisplayNames[item.unit]}`}</td>
                <td>{item.expirationDate}</td>
                <td>{item.category}</td>
                <td className="d-flex justify-content-between">
                    <span>{item.location ?? ""}</span>
                    <div>
                        <button type="button" className="btn btn-primary btn-sm me-4" onClick={() => onEditClick(item)} data-bs-toggle="modal" data-bs-target="#add-pantry">
                        <FaPencilAlt />
                        </button>
                        <button type="button" style={{backgroundColor: '#FF6E6E', color: 'white'}} className="btn btn-danger btn-sm me-3" onClick={() => removePantry(item.id)}>
                        <FaTrash />
                        </button>
                    </div>
                </td>
                </tr>
            ))}
            </tbody>
            </table>
            </div>
            <BsPlusCircleFill size={35} style={{ color: '#588157', position: 'fixed', bottom: '50px', right: '50px', zIndex: 1 }} data-bs-toggle="modal" data-bs-target="#add-pantry" />
            <CreatePantry editingItem={editingItem} setEditingItem={onEditClick}/>
        </div>
        // </Session>
    )
}