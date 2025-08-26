import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as client from "./client";
import { addPantry, updatePantry } from "./reducer";
import { Item } from "./Pantry";

interface CreatePantryProps {
  editingItem: Item | null;
  setEditingItem: React.Dispatch<React.SetStateAction<Item | null>>;
  setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>;
};

const initialState: Item = {
    id: null,
    name: '',
    quantity: '',
    unit: '',
    expirationDate: '',
    category: '',
    location: ''
};

export default function CreatePantry({editingItem, setEditingItem, setAlertMessage}: CreatePantryProps) {
    const [pantryItem, setPantryItem] = useState(initialState);
    const [units, setUnits] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const dispatch = useDispatch();

    const handleCancel = () => {
        setPantryItem(initialState);
        setEditingItem(null);
    };

    const fetchUnits = async () => {
        const data = await client.getUnit();
        console.log(data);
        setUnits(data);
    };

    const fetchCatgories = async () => {
        const data = await client.getCategory();
        setCategories(data);
    };

    const handleSubmit = async () => {
        try {
            const quantity = (pantryItem.quantity || "").toString().trim();
            const validQuantityString = /^\d+(\.\d{1,3})?$/;
            if (!validQuantityString.test(quantity) || Number(quantity) <= 0) {
                setAlertMessage("Quantity must be a valid number.");
                setTimeout(() => setAlertMessage(""), 3000);
                setPantryItem(initialState);
                setEditingItem(null);
                return;
            }

            if (pantryItem.id) {
                const updatedPantry = await client.updatePantry(pantryItem.id, pantryItem);
                dispatch(updatePantry(updatedPantry));
            } else {
                const newPantry = await client.createPantry(pantryItem);
                dispatch(addPantry(newPantry));
            }
            
        } catch (error: any) {
            if (error) {
                setAlertMessage("Please fill in the name, quantity, unit, and category fields.");
                setTimeout(() => {
                    setAlertMessage("");
                }, 3000);
            }
        }
        setPantryItem(initialState);
        setEditingItem(null);
    };

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
    
    useEffect(() => {
        fetchUnits();
        fetchCatgories();
    }, [])

    return (
        <div id="add-pantry" className="modal fade" data-bs-backdrop="static" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <form onSubmit={(e) => { e.preventDefault();handleSubmit()}}>
                    <div className="modal-header">
                        <h5 className="modal-title">{pantryItem.id ? "Edit Pantry Item" : "Add Pantry Item"}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <div className="container">
                            <div className="input-group custom-input-group mb-3">
                                <span className="input-group-text">Name</span>
                                <input type="text" id="name" className="form-control" value={pantryItem.name} onChange={(e) => setPantryItem({ ...pantryItem, name: e.target.value})}/>
                            </div>
                            <div className="d-flex">
                                <div className="input-group custom-input-group mb-3 me-3" style={{flex: 4}}>
                                    <span className="input-group-text">Quantity</span>
                                    <input type="text" id="quantity" className="form-control" value={pantryItem.quantity} onChange={(e) => setPantryItem({...pantryItem, quantity: e.target.value})}/>
                                </div>
                                <div className="input-group custom-input-group mb-3" style={{flex: 6}}>
                                    <span className="input-group-text">Measurement</span>
                                    <select className="form-select" id="unit" value={pantryItem.unit} onChange={(e) => setPantryItem({ ...pantryItem, unit: e.target.value})}>
                                        <option value=""></option>
                                        {units.map((unit) => (
                                            <option value={unit.displayName}>{unit.name}</option>
                                        ))}
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
                                        {categories.map((category) => (
                                            <option value={category.name}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>      
                                <div className="input-group custom-input-group mb-3">
                                <span className="input-group-text">Location</span>
                                    <select className="form-select custom-select" value={pantryItem.location} onChange={(e) => setPantryItem({...pantryItem, location: e.target.value})}>
                                        <option value=""></option>
                                        <option value="Cabinet">Cabinet</option>
                                        <option value="Storage room">Storage Room</option>
                                    </select>
                            </div>
                        </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={handleCancel} style={{backgroundColor: '#8f9993ff', color: '#FEFEFE', borderRadius: '10px', padding: '2px 10px', border: '3px solid #8f9993ff', marginRight: '10px'}} data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" style={{backgroundColor: '#0A5C36', color: '#FEFEFE', borderRadius: '10px', padding: '2px 10px', border: '3px solid #0A5C36'}} data-bs-dismiss="modal">Save</button>
                        </div>
                    </form>
                </div>
            </div>    
        </div>
    )
}