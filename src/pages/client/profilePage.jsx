import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/users/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                setName(userData.firstName || "");
            } else {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            localStorage.removeItem('token');
            navigate('/login');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/api/users/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ firstName: name })
            });
            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                setEditing(false);
            } else {
                const errorText = await response.text();
                console.error('Failed to update user:', response.status, errorText);
                alert('Failed to update user: ' + errorText);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error updating user: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: "var(--highlight)" }}></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p style={{ color: "var(--text-primary)" }}>User not found. Please log in.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Profile</h1>
            <div className="bg-surface rounded-lg p-6 shadow-md" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Name</label>
                        {editing ? (
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                                style={{ background: "var(--bg-base)", color: "var(--text-primary)", borderColor: "var(--border)" }}
                            />
                        ) : (
                            <p className="text-lg" style={{ color: "var(--text-primary)" }}>{user.firstName} {user.lastName}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Email</label>
                        <p className="text-lg" style={{ color: "var(--text-primary)" }}>{user.email}</p>
                    </div>
                    {user.createdAt && (
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Joined</label>
                            <p className="text-lg" style={{ color: "var(--text-primary)" }}>{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    )}
                </div>
                <div className="mt-6 flex gap-4">
                    {editing ? (
                        <>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setEditing(false);
                                    setName(user.firstName);
                                }}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setEditing(true)}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                            Edit Name
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}