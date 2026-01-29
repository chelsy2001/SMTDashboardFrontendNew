import { useState, useEffect } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchUsername, login } from "../services/operations/authAPI.jsx"
import warehouseImg from "../assets/images/loginBackground1.png"

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [usernames, setUsernames] = useState([])

  const { username, password } = formData

  useEffect(() => {
    const getUsernames = async () => {
      const response = await fetchUsername()()
      if (Array.isArray(response?.data)) {
        setUsernames(response.data)
      }
    }
    getUsernames()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login(username, password, navigate))
  }

  return (
    <div className="min-h-screen bg-[#EEF3F6] flex items-center justify-center px-4">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT – Illustration */}
        <div className="hidden md:flex items-center justify-center bg-[#F7FAFC] p-10">
          <img
            src={warehouseImg}
            alt="Warehouse Automation"
            className="max-w-full h-auto"
          />
        </div>

        {/* RIGHT – Login */}
        <div className="flex items-center justify-center p-10">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              SMT Dashboard Login
            </h2>
            <p className="text-gray-500 mb-8">
              Login to manage automation dashboard
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Username
                </label>
                <select
                  name="username"
                  value={username}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-gray-400 focus:outline-none"
                >
                  <option value="">Select username</option>
                  {usernames.map((u, i) => (
                    <option key={i} value={u.Username}>
                      {u.Username}
                    </option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={handleChange}
                    required
                    placeholder="Enter password"
                    className="w-full px-4 py-3 border rounded-md pr-10 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible size={18} />
                    ) : (
                      <AiOutlineEye size={18} />
                    )}
                  </span>
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-[#6B8F8A] text-white py-3 rounded-md font-medium hover:bg-[#5A7C77] transition"
              >
                Login
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login
