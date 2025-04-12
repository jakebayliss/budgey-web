import { Link } from "react-router-dom";
import { Day } from "../interfaces/Day";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Transaction from "../interfaces/Transaction";
import { setTransactions } from "../redux/transactionsSlice";
import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Home = () => {
    const dispatch = useDispatch();
    const transactions = useSelector((state: RootState) => state.transactions.transactions);
    const [selectedDay, setSelectedDay] = useState<Date>(() => {
        const savedDate = localStorage.getItem('selectedDay');
        return savedDate ? new Date(savedDate) : new Date();
    });
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        localStorage.setItem('selectedDay', selectedDay.toISOString());
        updateFilteredTransactions(selectedDay);
    }, [selectedDay]);

    const getTransactionsForDate = (date: Date) => {
        return transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            return transactionDate.getDate() === date.getDate() &&
                transactionDate.getMonth() === date.getMonth() &&
                transactionDate.getFullYear() === date.getFullYear();
        });
    }

    const updateFilteredTransactions = (date: Date) => {
        const transactionsForDate = getTransactionsForDate(date);
        setFilteredTransactions(transactionsForDate);
        setSelectedDay(date);
    }

    const navigateDay = (direction: 'prev' | 'next') => {
        const newDate = new Date(selectedDay);
        if (direction === 'prev') {
            newDate.setDate(selectedDay.getDate() - 1);
        } else {
            newDate.setDate(selectedDay.getDate() + 1);
        }
        updateFilteredTransactions(newDate);
    }

    const getCurrentWeek = () => {
        const week: Day[] = [];
        for (let i = -3; i <= 3; i++) {
            const date = new Date(selectedDay);
            date.setDate(selectedDay.getDate() + i);
            const day: Day = {
                date: date,
                isToday: date.toDateString() === new Date().toDateString(),
                name: date.toLocaleDateString('en-AU', { weekday: 'short' }),
            };
            week.push(day);
        }
        return week;
    }

    const getTransformOffset = () => {
        const dayWidth = 60; // Width of each day element including padding
        const gap = 8; // Gap between days
        const totalWidth = dayWidth + gap;
        const selectedIndex = 3; // The selected day is always at index 3
        const containerWidth = 280; // Width of the container
        
        const centerOffset = containerWidth / 2; // Center of the container
        const selectedDayCenter = (selectedIndex * totalWidth) + (dayWidth / 2); // Center of the selected day
        
        return -(selectedDayCenter - centerOffset + 20); // Negative offset to move the selected day to the center
    }
    
    const week = getCurrentWeek();

    const deleteTransaction = (transaction: Transaction) => {
        const updatedTransactions = transactions.filter((t) => t.id !== transaction.id);
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        dispatch(setTransactions(updatedTransactions));
        setFilteredTransactions(updatedTransactions);
    }

    const getCategoryTotals = () => {
        const categoryTotals: { [key: string]: number } = {};
        filteredTransactions.forEach(transaction => {
            if (!categoryTotals[transaction.category]) {
                categoryTotals[transaction.category] = 0;
            }
            categoryTotals[transaction.category] += transaction.amount;
        });
        return categoryTotals;
    }

    const getDailyTotal = () => {
        return filteredTransactions.reduce((total, transaction) => total + transaction.amount, 0);
    }

    return (
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl">
            <div className="rounded-lg p-4 sm:p-6 mb-4 sm:mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Daily Transactions</h2>
                </div>

                <div className="mb-4 sm:mb-6">
                    <div className="flex items-center justify-center gap-2">
                        <button 
                            onClick={() => navigateDay('prev')}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <ChevronLeftIcon className="h-6 w-6" />
                        </button>
                        <div className="flex gap-2 sm:gap-4 items-center w-[280px] sm:w-[400px] overflow-hidden">
                            <div className="flex gap-2 sm:gap-4 items-center transition-transform duration-300 ease-in-out"
                                 style={{ transform: `translateX(${getTransformOffset()}px)` }}>
                                {week.map((day, index) => (
                                    <div
                                        key={index}
                                        className={`flex flex-col items-center px-3 py-2 rounded-lg transition-colors whitespace-nowrap w-[60px]
                                            ${day.date.toDateString() === selectedDay.toDateString() ? 'bg-gray-800' : ''}
                                            ${day.isToday ? 'text-green-400' : 'text-gray-300'}`}
                                        onClick={() => updateFilteredTransactions(day.date)}
                                    >
                                        <span className="text-sm">{day.name}</span>
                                        <span className="text-xs">{day.date.getDate()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button 
                            onClick={() => navigateDay('next')}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <ChevronRightIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                                <th className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {filteredTransactions.length > 0 ? (
                                <>
                                    {filteredTransactions.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-800">
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-left text-gray-300">{transaction.category}</td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-left text-gray-300">${transaction.amount}</td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm">
                                                <button 
                                                    onClick={() => deleteTransaction(transaction)} 
                                                    className="text-red-400 hover:text-red-300 font-medium">
                                                    X
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="border-t-2 border-gray-700">
                                        <td colSpan={3} className="px-3 sm:px-6 py-3 sm:py-4">
                                            <div className="space-y-2">
                                                {Object.entries(getCategoryTotals()).map(([category, total]) => (
                                                    <div key={category} className="flex justify-between text-sm">
                                                        <span className="text-gray-400">{category} Total:</span>
                                                        <span className="text-gray-300">${total}</span>
                                                    </div>
                                                ))}
                                                <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-700">
                                                    <span className="text-gray-300">Daily Total:</span>
                                                    <span className="text-white">${getDailyTotal()}</span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </>
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-3 sm:px-6 py-3 sm:py-4 text-center text-sm text-gray-400">
                                        No transactions for this day
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Fixed bottom navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
                <div className="container mx-auto max-w-4xl flex justify-center gap-4">
                    <Link 
                        to="/categories" 
                        className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors text-center flex-1"
                    >
                        Categories
                    </Link>
                    <Link 
                        to={`/add?date=${selectedDay.getFullYear()}-${String(selectedDay.getMonth() + 1).padStart(2, '0')}-${String(selectedDay.getDate()).padStart(2, '0')}`}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-center flex-1"
                    >
                        Add Transaction
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Home;
