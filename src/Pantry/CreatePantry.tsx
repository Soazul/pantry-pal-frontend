import { useEffect, useState } from "react";
import styles from "./Pantry.module.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as client from "./client";
import { addPantry, setPantry, updatePantry } from "./reducer";

export default function CreatePantry({editingItem, setEditingItem}) {
    const initialState = {
        id: null,
        name: '',
        quantity: '',
        unit: '',
        expirationDate: '',
        category: '',
        location: '',
    };
    const [pantryItem, setPantryItem] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const handleCancel = () => {
    //     setPantryItem(initialState);
    // };

    // const handleSubmit = async () => {
    //     let newPantry = await client.createPantry(pantryItem);
    //     dispatch(addPantry(newPantry));
    //     setPantryItem(initialState);
    //     window.location.reload();
    // };

    // useEffect(() => {
    //     const modalElement = document.getElementById("add-pantry");
    //     const resetFields = () => setPantryItem(initialState);
    //     if (modalElement) {
    //         modalElement.addEventListener("show.bs.modal", resetFields);
    //     }
    //     return () => {
    //         if (modalElement) {
    //             modalElement.removeEventListener("show.bs.modal", resetFields);
    //         }
    //     };
    // }, [initialState]);

      useEffect(() => {
    if (editingItem) {
      setPantryItem({
        id: editingItem.id,
        name: editingItem.name,
        quantity: editingItem.quantity,
        unit: editingItem.unit,
        expirationDate: editingItem.expirationDate,
        category: editingItem.category,
        location: editingItem.location,
      });
    } else {
      setPantryItem(initialState);
    }
  }, [editingItem]);

    const handleCancel = () => {
    setPantryItem(initialState);
    setEditingItem(null);
  };

  const handleSubmit = async () => {
    if (pantryItem.id) {
      // Editing existing
      const updatedPantry = await client.updatePantry(pantryItem.id, pantryItem);
      
      dispatch(updatePantry(updatedPantry));
     
    } else {
      // Adding new
      const newPantry = await client.createPantry(pantryItem);
      
      dispatch(addPantry(newPantry));
    }
    setPantryItem(initialState);
    setEditingItem(null);
             const modalElement = document.getElementById("add-pantry");
                     const resetFields = () => setPantryItem(initialState);
if (modalElement) {
            modalElement.addEventListener("show.bs.modal", resetFields);
        }
        return () => {
            if (modalElement) {
                modalElement.removeEventListener("show.bs.modal", resetFields);
            }
        };
  };

    return (
        <div id="add-pantry" className="modal fade" data-bs-backdrop="static" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <form onSubmit={(e) => {e.preventDefault(); handleSubmit()}}>
                    <div className="modal-header">
                        <h5 className="modal-title">{pantryItem.id ? "Edit Pantry Item" : "Add Pantry Item"}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <div className="container">
                            <div className="input-group custom-input-group mb-3">
                                <span className="input-group-text">Name</span>
                                <input type="text" id="name" className="form-control" value={pantryItem.name} onChange={(e) => setPantryItem({ ...pantryItem, name: e.target.value })}/>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div className="input-group custom-input-group mb-3 me-3">
                                    <span className="input-group-text">Quantity</span>
                                    <input type="number" min="1" id="quantity" className="form-control" value={pantryItem.quantity} onChange={(e) => setPantryItem({...pantryItem, quantity: e.target.value})}/>
                                </div>
                                <div className="input-group custom-input-group mb-3">
                                    <span className="input-group-text">Measures</span>
                                    <select className="form-select" id="unit" value={pantryItem.unit} onChange={(e) => setPantryItem({ ...pantryItem, unit: e.target.value })}>
                                        <option value=""></option>
                                        <option value="GRAMS">Grams</option>
                                        <option value="KILOGRAMS">Kilograms</option>
                                        <option value ="OUNCES">Ounces</option>
                                        <option value="POUNDS">Pounds</option>
                                        <option value="LITERS">Liters</option>
                                        <option value="MILLILITERS">Milliliters</option>
                                        <option value="CUPS">Cups</option>
                                        <option value="TABLESPOONS">Tablespoons</option>
                                        <option value="TEASPOONS">Teaspoons</option>
                                        <option value="PIECES">Pieces</option>
                                    </select>
                                </div>
                        </div>
                        <div className="input-group custom-input-group mb-3">
                           <span className="input-group-text">Expiration Date</span>
                            <input type="date" id="expiration_date"className="form-control" value={pantryItem.expirationDate} onChange={(e) => setPantryItem({...pantryItem, expirationDate: e.target.value})}/>
                        </div>
                            <div className="input-group custom-input-group mb-3">
                            <span className="input-group-text">Category</span>
                                <select className="form-select custom-select" value={pantryItem.category} onChange={(e) => setPantryItem({...pantryItem, category: e.target.value})}>
                                    <option value=""></option>
                                    <option value="grain">Grain</option>
                                    <option value="snack">Snack</option>
                                </select>
                            </div>      
                            <div className="input-group custom-input-group mb-3">
                            <span className="input-group-text">Location</span>
                                <select className="form-select custom-select" value={pantryItem.location} onChange={(e) => setPantryItem({...pantryItem, location: e.target.value})}>
                                    <option value=""></option>
                                    <option value="cabinet">Cabinet</option>
                                    <option value="storage_room">Storage Room</option>
                                </select>
                           </div>
                      </div>
                    </div>
                     <div className="modal-footer">
                        <button onClick={handleCancel} style={{backgroundColor: '#8f9993ff', color: '#FEFEFE', borderRadius: '10px', padding: '2px 10px', border: '3px solid #8f9993ff', marginRight: '10px'}} data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" style={{backgroundColor: '#0A5C36', color: '#FEFEFE', borderRadius: '10px', padding: '2px 10px', border: '3px solid #0A5C36'}} data-bs-dismiss="modal">Save</button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    )
}