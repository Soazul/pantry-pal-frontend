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

export interface Item {
    id: number | null,
    name: string,
    quantity: string,
    unit: string,
    expirationDate: string,
    category: string,
    location: string
};

export default function Pantry() {
    const pantry = useSelector((state: any) => state.pantryItems.pantryItems);
    const dispatch = useDispatch();
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [previousPantryLength, setPreviousPantryLength] = useState(0);
    const [activeSort, setActiveSort] = useState<any>({field: null, direction: null});
    const [expirationFilter, setExpirationFilter] = useState<null | 'week' | 'month'>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>("");
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<any[]>([]);

    const fetchPantry = async () => {
        const data = await client.getPantry();
        dispatch(setPantry(data));
    };

    const fetchCatgories = async () => {
        const data = await client.getCategory();
        setCategories(data);
    };

    const removePantry = async (pantryId: any) => {
        await client.deletePantry(pantryId);
        dispatch(deletePantry(pantryId));
    };

    // sort
    const sortItems = (list: any[], field: any, ascending: boolean) => {
        return [...list].sort((a, b) => {
            const value1 = a[field];
            const value2 = b[field];
            let compare: number;

            if (!value1 && !value2) return 0;
            if (!value1) return 1;
            if (!value2) return -1;

            if (field === 'expirationDate') {
                compare = new Date(value1).getTime() - new Date(value2).getTime();
            } 
            else {
                compare = value1.toLowerCase().localeCompare(value2.toLowerCase());
            }
            return ascending ? compare : -compare;
        });
    };

    const handleSort = (field: string, direction: 'asc' | 'desc') => {
        if (activeSort.field === field && activeSort.direction === direction) {
            setActiveSort({ field: null, direction: null });
        } else {
            setActiveSort({ field, direction });
        }
        setCurrentPage(1);
    };

    // filter
    const handleFilterChange = (type: 'category' | 'expiration', value: 'week' | 'month', checked?: boolean) => {
        if (type === 'category') {
            if (checked) {
                setSelectedCategories([...selectedCategories, value]);
            } else {
                setSelectedCategories(selectedCategories.filter(c => c !== value));
            }
        } else if (type === 'expiration') {
            setExpirationFilter(checked ? value : null);
        }
    };

    // search bar
    let processedList = pantry.filter((item: any) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // expiration filter
    if (expirationFilter) {
        const now = new Date();
        processedList = processedList.filter((item: any) => {
            if (!item.expirationDate) return false;
            const expDate = new Date(item.expirationDate);
            const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            
            if (expirationFilter === 'week') return diffDays >= 0 && diffDays <= 7;
            if (expirationFilter === 'month') return diffDays >= 0 && diffDays <= 30;
            return true;
        });
    };

    const categoryCounts: Record<string, number> = {};
    selectedCategories.forEach((category) => {
        categoryCounts[category] = processedList.filter((item: any) => item.category === category).length;
    });

    // category filter
    if (selectedCategories.length > 0) {
        processedList = processedList.filter((item: any) =>
            selectedCategories.includes(item.category)
        );
    };
    
    if (activeSort.field) {
        processedList = sortItems(processedList, activeSort.field, activeSort.direction === 'asc');
    };

    const totalPages = Math.ceil(processedList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayItems = processedList.slice(startIndex, startIndex + itemsPerPage);
    const getPageNumbersToDisplay = () => {
        if (totalPages <= 3) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        let start = Math.min(Math.max(currentPage - 1, 1), totalPages - 2);
        return [start, start + 1, start + 2];
    };

    // dynamically update current page based on number of items
    useEffect(() => {
        const currentLength = processedList.length;
        const newTotalPages = Math.ceil(currentLength / itemsPerPage);
        // if user adds an item go to the last page (if sortactive is true don't go to the first page)
        if (currentLength > previousPantryLength && previousPantryLength > 0) {
            const previousTotalPages = Math.ceil(previousPantryLength / itemsPerPage);
            if (newTotalPages > previousTotalPages || (currentPage < previousTotalPages && newTotalPages > 1)) {
                setCurrentPage(newTotalPages);
            }
        // if user deletes an item and the current page no longer exist move to the new last page
        } else {
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            }
        }
        setPreviousPantryLength(currentLength);
    }, [processedList.length, previousPantryLength, currentPage]);

    useEffect(() => {
        fetchPantry();
        fetchCatgories();
    }, []);
    
    return (
        // <Session>
        <div>
        <Header/>
        <div className="container">
            <div className="row justify-content-between mt-5">
                <div className="col-6">
                    <input className={styles.searchbar} type="search" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                </div>

                <div className="col-6 d-flex justify-content-end align-items-center gap-4">
                    <div className="dropdown">
                        <button type="button" className={`${styles.btn} dropdown-toggle`} data-bs-toggle="dropdown">Filter By</button>
                        <div className="dropdown-menu p-3" style={{width: '250px'}}>
                            {categories.map((category) => (
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id={category.name} value={category.name} checked={selectedCategories.includes(category.name)} onChange={(e) => handleFilterChange('category', category.name, e.target.checked)}/>
                                    <label className="form-check-label" htmlFor={category.name}>{category.name}</label>
                                </div>
                            ))}
                            <div className="dropdown-divider"></div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="expWeek"
                                    checked={expirationFilter === 'week'}
                                    onChange={(e) => handleFilterChange('expiration', 'week', e.target.checked)} />
                                <label className="form-check-label" htmlFor="expWeek">Exp. Week</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="expMonth"
                                    checked={expirationFilter === 'month'}
                                    onChange={(e) => handleFilterChange('expiration', 'month', e.target.checked)} />
                                <label className="form-check-label" htmlFor="expMonth">Exp. Month</label>
                            </div>
                        </div>
                    </div>
                    <ul className="pagination mb-0">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link"style={{backgroundColor: currentPage === 1 ? '#eaecef' : '#D5E7DD', border: 'none'}} onClick={() => setCurrentPage(currentPage - 1)}>
                        <span aria-hidden="true" style={{color: '#000000'}}>&laquo;</span>
                        </button>
                        </li>

                        {getPageNumbersToDisplay().map(pageNum => (
                        <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                            <button className="page-link" style={{backgroundColor: currentPage === pageNum ? '#0A5C36' : '#D5E7DD', color: currentPage === pageNum ? '#FEFEFE' : '#000000', border: 'none'}} onClick={() => setCurrentPage(pageNum)}>{pageNum}</button>
                        </li>
                        ))}

                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" style={{backgroundColor: currentPage === totalPages ? '#eaecef' : '#D5E7DD', border: 'none'}} onClick={() => setCurrentPage(currentPage + 1)}>
                        <span aria-hidden="true"  style={{color: '#000000'}}>&raquo;</span>
                        </button>
                        </li>
                    </ul>
                </div>
            </div>
            {alertMessage &&
                <div className="alert alert-danger alert-dismissible fade show mt-3 p-2" role="alert">
                {alertMessage}
                <button type="button" className="btn-close" data-dismiss="alert" style={{transform: 'scale(0.7)',  marginTop: '-7px'}} onClick={() => setAlertMessage("")}></button>
            </div>}
            <div className="d-flex flex-wrap gap-2 mb-3 mt-3">
            {selectedCategories.map((category) => (
                <span className="badge badge-pill d-flex align-items-center" style={{gap: '0.1rem', backgroundColor: '#0A5C36'}}>{category} ({categoryCounts[category] ?? 0})
                    <button type="button" className="btn-close btn-close-white" style={{transform: 'scale(0.7)'}} onClick={() => {setSelectedCategories(selectedCategories.filter(c => c !== category))}}></button>
                </span>
            ))}
            {expirationFilter && (
                <span className="badge badge-pill bg-warning d-flex align-items-center" style={{gap: '0.1rem'}}>
                    {expirationFilter === 'week' ? 'Expires within a week' : 'Expires within a month'}
                    <button type="button" className="btn-close btn-close-white" style={{transform: 'scale(0.7)'}} onClick={() => {setExpirationFilter(null)}}>
                    </button>
                </span>
            )}
            </div>
            <table className="table">
            <thead className="table-success">
                <tr>
                <th scope="col">#</th>
                <th scope="col">
                    <div style={{display: 'flex', gap: '10px'}}>
                        Name
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <i className="fa fa-sort-up" style={{color: activeSort.field === 'name' && activeSort.direction === 'asc' ? '#000000' : '#FEFEFE', cursor: 'pointer', fontSize: '1.2em'}} onClick={() => handleSort('name', 'asc')}></i>
                            <i className="fa fa-sort-down" style={{color: activeSort.field === 'name' && activeSort.direction === 'desc' ? '#000000' : '#FEFEFE', cursor: 'pointer', fontSize: '1.2em', marginTop: '-15px'}} onClick={() => handleSort('name', 'desc')}></i>
                        </div>
                    </div>
                </th>
                
                <th scope="col">Quantity</th>
                <th scope="col">
                    <div style={{display: 'flex', gap: '10px'}}>
                        Expiration Date
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <i className="fa fa-sort-up" style={{color: activeSort.field === 'expirationDate' && activeSort.direction === 'asc' ? '#000000' : '#FEFEFE', cursor: 'pointer', fontSize: '1.2em'}} onClick={() => handleSort('expirationDate', 'asc')}></i>
                            <i className="fa fa-sort-down" style={{color: activeSort.field === 'expirationDate' && activeSort.direction === 'desc' ? '#000000' : '#FEFEFE', cursor: 'pointer', fontSize: '1.2em', marginTop: '-15px'}} onClick={() => handleSort('expirationDate', 'desc')}></i>
                        </div>
                    </div>
                </th>
                <th scope="col">
                   <div style={{display: 'flex', gap: '10px'}}>
                        Category
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <i className="fa fa-sort-up" style={{color: activeSort.field === 'category' && activeSort.direction === 'asc' ? '#000000' : '#FEFEFE', cursor: 'pointer', fontSize: '1.2em'}} onClick={() => handleSort('category', 'asc')}></i>
                            <i className="fa fa-sort-down" style={{color: activeSort.field === 'category' && activeSort.direction === 'desc' ? '#000000' : '#FEFEFE', cursor: 'pointer', fontSize: '1.2em', marginTop: '-15px'}} onClick={() => handleSort('category', 'desc')}></i>
                        </div>
                    </div>
                </th>
                <th scope="col">
                    <div style={{display: 'flex', gap: '10px'}}>
                        Location
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <i className="fa fa-sort-up" style={{color: activeSort.field === 'location' && activeSort.direction === 'asc' ? '#000000' : '#FEFEFE', cursor: 'pointer', fontSize: '1.2em'}} onClick={() => handleSort('location', 'asc')}></i>
                            <i className="fa fa-sort-down" style={{color: activeSort.field === 'location' && activeSort.direction === 'desc' ? '#000000' : '#FEFEFE', cursor: 'pointer', fontSize: '1.2em', marginTop: '-15px'}} onClick={() => handleSort('location', 'desc')}></i>
                        </div>
                    </div>
                </th>
                </tr>
            </thead>
            <tbody>
            {displayItems.length > 0 ? (displayItems.map((item: any, index: number) => (
                <tr key={item.id} className={(() => {
                    if (!item.expirationDate) return '';
                    const now = new Date();
                    const expDate = new Date(item.expirationDate);
                    const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    if (diffDays >= 0 && diffDays <= 7) return 'table-warning'; 
                    return '';
                })()}>
                <th scope="row">{startIndex + index + 1}</th>
                <td>{item.name}</td>
                <td>{`${item.quantity} ${item.unit}`}</td>
                <td>{item.expirationDate}</td>
                <td>{item.category}</td>
                <td className="d-flex justify-content-between">
                    <span>{item.location ?? ""}</span>
                    <div>
                        <button type="button" style={{backgroundColor: '#bfdafd'}} className="btn btn-sm me-3" onClick={() => setEditingItem(item)} data-bs-toggle="modal" data-bs-target="#add-pantry">
                        <FaPencilAlt style={{marginBottom: '3px'}}/>
                        </button>
                        <button type="button" style={{backgroundColor: '#eec7cc'}} className="btn btn-sm me-2" onClick={() => removePantry(item.id)}>
                        <FaTrash style={{marginBottom: '3px'}}/>
                        </button>
                    </div>
                </td>
                </tr>))) : (
                <tr>
                <td colSpan={6} className="text-center text-muted">
                    Add your pantry items
                </td>
                </tr>
                )}
            </tbody>
            </table>
            </div>
            <BsPlusCircleFill size={35} style={{color: '#588157', zIndex: 1,  position: 'absolute', bottom: '50px', right: '50px'}} data-bs-toggle="modal" data-bs-target="#add-pantry" onClick={() => setEditingItem(null)}/>
            <CreatePantry editingItem={editingItem} setEditingItem={setEditingItem} setAlertMessage={setAlertMessage}/>
        </div>
        // </Session>
    )
}