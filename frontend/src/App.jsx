import { useEffect, useState } from "react"
import "./App.css"

const API = "http://127.0.0.1:3000/items"

function App() {
    const [items, setItems] = useState([])
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [editId, setEditId] = useState(null)

    const getItems = async () => {
        const response = await fetch(API)
        const data = await response.json()
        setItems(data)
    }

    useEffect(() => {
        getItems()
    }, [])

    const saveItem = async (e) => {
        e.preventDefault()

        if (!name.trim() || price === "") {
            alert("Enter name and price")
            return
        }

        const url = editId ? `${API}/${editId}` : API

        await fetch(url, {
            method: editId ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                price: Number(price)
            })
        })

        setName("")
        setPrice("")
        setEditId(null)

        getItems()
    }

    const editItem = (item) => {
        setEditId(item.id)
        setName(item.name)
        setPrice(item.price)
    }

    const deleteItem = async (id) => {
        if (!confirm("Delete this item?")) return

        await fetch(`${API}/${id}`, {
            method: "DELETE"
        })

        getItems()
    }

    return (
        <div className="page">

            <header>
                <div>
                    <small>CRUD APPLICATION</small>
                    <h1>Item Manager</h1>
                </div>

                <div className="count">
                    <b>{items.length}</b>
                    <span>Items</span>
                </div>
            </header>

            <main>

                <section className="form-section">

                    <h2>
                        {editId ? "Edit Item" : "Add New Item"}
                    </h2>

                    <p>
                        {editId
                            ? "Update the selected item."
                            : "Enter the details of your new item."}
                    </p>

                    <form onSubmit={saveItem}>

                        <label>Item Name</label>

                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Laptop"
                        />

                        <label>Price</label>

                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="e.g. 50000"
                        />

                        <button>
                            {editId ? "Update Item" : "Add Item"}
                        </button>

                        {editId && (
                            <button
                                type="button"
                                className="cancel"
                                onClick={() => {
                                    setEditId(null)
                                    setName("")
                                    setPrice("")
                                }}
                            >
                                Cancel
                            </button>
                        )}

                    </form>

                </section>

                <section className="list-section">

                    <h2>Items</h2>

                    {items.length === 0 ? (
                        <div className="empty">
                            No items added yet.
                        </div>
                    ) : (

                        items.map((item) => (
                            <div className="item" key={item.id}>

                                <div className="item-id">
                                    #{item.id}
                                </div>

                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    <span>Product</span>
                                </div>

                                <strong>
                                    ₹{item.price}
                                </strong>

                                <div className="actions">

                                    <button
                                        onClick={() => editItem(item)}
                                        className="edit"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        className="delete"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>
                        ))

                    )}

                </section>

            </main>

        </div>
    )
}

export default App