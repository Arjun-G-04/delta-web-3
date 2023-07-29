import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styles from "../styles/Header.module.css"
import axios from "axios"

export default function Header(props) {
    const baseURL = process.env.REACT_APP_BASE_URL
    const [focus, setFocus] = useState(false)
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [inpValue, setInpValue] = useState("")
    const [imageURL, setImageURL] = useState('/defaultProfile.png')
    const { name, username } = props

    useEffect(() => {
        axios.get(baseURL+"/users")
            .then((res) => {
                setData(res.data)
            })

        axios.get(baseURL+`/hub/profilePic/${username}`, {
            responseType: "blob"
        })
            .then((res) => {
                setImageURL(URL.createObjectURL(res.data))
            })
    },[])

    function handleChange(event) {
        const word = event.target.value
        setInpValue(word)
        const filtered = data.filter((value) => {
            return value["fullName"].toLowerCase().includes(word.toLowerCase())
        })

        if (word === "") {
            setFilteredData([])
        } else {
            setFilteredData(filtered)
        }
    }

    function handleFocus() {
        setFocus(true)
    }

    function handleBlur() {
        setTimeout(() => {
            setInpValue("")
            setFilteredData([])
            setFocus(false)
        }, 150)
    }

    return <div className={styles.body}>
        <div className={styles.searchContent}>
            <div className={`${styles.searchBox} ${ focus ? styles.expand : ""}`}>
                <div className={styles.searchIcon}></div>
                <input value={inpValue} className={styles.searchInput} onFocus={handleFocus} onBlur={handleBlur}
                    onChange={handleChange} placeholder="Search users"></input>
            </div>
            <div className={`${styles.resultBox} ${ focus ? styles.expand : ""}`}>
                {filteredData.map((value) => {
                    return <Link to={`/user/${value['username']}`} style={{ textDecoration: 'none' }}><div key={value["username"]} className={styles.result}>
                        {value["fullName"]} <div>({value["username"]})</div>
                    </div>
                    </Link>
                })}
            </div>
        </div>
        <div className={styles.user}>
            <Link to={`/user/${username}`} style={{ textDecoration: 'none' , textAlign: "right"}}>
                <span>{name}</span>
            </Link>
            <Link to={`/user/${username}`} style={{ textDecoration: 'none' }}>
                <div className={styles.pic} style={{backgroundImage: `url('${imageURL}')`}}></div>
            </Link>
        </div>
    </div>
}