import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTransactions } from '../redux/transactionsSlice';
import Transaction from '../interfaces/Transaction';
import Category from '../interfaces/Category';
import { v4 as uuidv4 } from 'uuid';

const AddTransaction = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [categories, setCategories] = useState<Category[]>([]);
    
    // Get the date from URL or use current date
    const urlDate = new URLSearchParams(location.search).get('date');
    const defaultDate = new Date();
    const initialDate = urlDate || `${defaultDate.getFullYear()}-${String(defaultDate.getMonth() + 1).padStart(2, '0')}-${String(defaultDate.getDate()).padStart(2, '0')}`;
    
    const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
        category: '',
        amount: 0,
        date: initialDate,
    });

    useEffect(() => {
        const savedCategories = localStorage.getItem('categories');
        if (savedCategories) {
            setCategories(JSON.parse(savedCategories));
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTransaction.category && newTransaction.amount) {
            const transaction: Transaction = {
                id: uuidv4(),
                category: newTransaction.category,
                amount: newTransaction.amount,
                date: newTransaction.date || new Date().toISOString(),
            };

            const savedTransactions = localStorage.getItem('transactions');
            const transactions = savedTransactions ? JSON.parse(savedTransactions) : [];
            const updatedTransactions = [...transactions, transaction];
            
            localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
            dispatch(setTransactions(updatedTransactions));
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Add New Transaction</h1>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-left">
                                Date
                            </label>
                            <input
                                type="date"
                                id="date"
                                value={newTransaction.date}
                                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                                className="mt-1 block w-full rounded-sm border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-left">
                                Category
                            </label>
                            <select
                                value={newTransaction.category}
                                onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-left">
                                Amount
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">$</span>
                                </div>
                                <input
                                    type="number"
                                    id="amount"
                                    value={newTransaction.amount}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) })}
                                    className="block w-full pl-7 rounded-sm border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="0.00"
                                    step="0.01"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-orange-400 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Add Transaction
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTransaction;