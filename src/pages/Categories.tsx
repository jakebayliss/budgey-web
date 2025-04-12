import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Category from '../interfaces/Category';
import { v4 as uuidv4 } from 'uuid';

const Categories = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState<{ name: string; budget: number }>({ name: '', budget: 0 });

    useEffect(() => {
        const savedCategories = localStorage.getItem('categories');
        if (savedCategories) {
            setCategories(JSON.parse(savedCategories));
        }
    }, []);

    const saveCategories = (updatedCategories: Category[]) => {
        setCategories(updatedCategories);
        localStorage.setItem('categories', JSON.stringify(updatedCategories));
    };

    const handleAddCategory = () => {
        if (newCategory.name.trim() && newCategory.budget > 0) {
            const category: Category = {
                id: uuidv4(),
                name: newCategory.name.trim(),
                budget: newCategory.budget,
            };
            saveCategories([...categories, category]);
            setNewCategory({ name: '', budget: 0 });
        }
    };

    const handleDeleteCategory = (id: string) => {
        saveCategories(categories.filter(category => category.id !== id));
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Categories</h1>
                <button
                    onClick={() => navigate('/')}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                    Back to Home
                </button>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Add New Category</h2>
                <div className="flex gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Category Name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                        type="number"
                        placeholder="Budget Amount"
                        value={newCategory.budget || ''}
                        onChange={(e) => setNewCategory({ ...newCategory, budget: parseFloat(e.target.value) || 0 })}
                        className="w-32 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        onClick={handleAddCategory}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Add Category
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Budget</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{category.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${category.budget}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <button
                                            onClick={() => handleDeleteCategory(category.id)}
                                            className="text-red-400 hover:text-red-300 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Categories; 