import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, LogIn, UserPlus } from 'lucide-react';

const GuestCTA = () => {
    return (
        <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl p-8 flex flex-col items-center text-center h-full justify-center">
            <div className="bg-white p-4 rounded-full shadow-sm mb-6">
                <ShieldCheck size={48} className="text-blue-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Manage your contacts securely
            </h2>
            
            <p className="text-gray-600 mb-8 max-w-sm">
                ConnectHub helps you organize your network. Log in to save and manage your private contact list.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                <Link 
                    to="/login" 
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                    <LogIn size={20} />
                    Login
                </Link>
                <Link 
                    to="/register" 
                    className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-6 rounded-lg border border-blue-200 transition-colors"
                >
                    <UserPlus size={20} />
                    Create Account
                </Link>
            </div>
        </div>
    );
};

export default GuestCTA;
