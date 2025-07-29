"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calendar, Shield, Edit2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import LoadingCube from "@/components/loading-cube"

interface ImagePost {
  id: string
  title: string
  description: string
  imageUrl: string
  element: string
  createdBy: string
  createdAt: string
}

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any | null>(null)
  const [userPosts, setUserPosts] = useState<ImagePost[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [newUsername, setNewUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/")
      return
    }

    const userData = JSON.parse(user)
    setCurrentUser(userData)
    setNewUsername(userData.username)

    // Load user's posts
    const allPosts: ImagePost[] = JSON.parse(localStorage.getItem("posts") || "[]")
    const posts = allPosts.filter((post) => post.createdBy === userData.username)
    setUserPosts(posts)

    setTimeout(() => setIsLoading(false), 3000)
  }, [router])

  const handleUpdateProfile = () => {
    if (newPassword && newPassword !== confirmPassword) {
      toast({
        title: "خطا",
        description: "رمز عبور و تکرار آن یکسان نیستند",
        variant: "destructive",
      })
      return
    }

    if (!currentUser) return

    // Check if username already exists (except current user)
    const allUsers: any[] = JSON.parse(localStorage.getItem("users") || "[]")
    const usernameExists = allUsers.find((u) => u.username === newUsername && u.id !== currentUser.id)

    if (usernameExists) {
      toast({
        title: "خطا",
        description: "این نام کاربری قبلاً ثبت شده است",
        variant: "destructive",
      })
      return
    }

    const updatedUser = {
      ...currentUser,
      username: newUsername,
      password: newPassword || currentUser.password,
    }

    // Update in users array
    const updatedUsers = allUsers.map((user) => (user.id === currentUser.id ? updatedUser : user))
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Update current user
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    setCurrentUser(updatedUser)

    // Update posts if username changed
    if (newUsername !== currentUser.username) {
      const allPosts: ImagePost[] = JSON.parse(localStorage.getItem("posts") || "[]")
      const updatedPosts = allPosts.map((post) =>
        post.createdBy === currentUser.username ? { ...post, createdBy: newUsername } : post,
      )
      localStorage.setItem("posts", JSON.stringify(updatedPosts))
      setUserPosts(updatedPosts.filter((post) => post.createdBy === newUsername))
    }

    setIsEditing(false)
    setConfirmPassword("")

    toast({
      title: "موفق",
      description: "پروفایل شما به‌روزرسانی شد",
    })
  }

  const goBack = () => {
    setIsLoading(true)
    setTimeout(() => {
      router.push("/dashboard")
    }, 3000)
  }

  if (isLoading) {
    return <LoadingCube />
  }

  if (!currentUser) {
    return null
  }

  const elementNames: { [key: string]: string } = {
    water: "آب",
    fire: "آتش",
    wind: "باد",
    earth: "خاک",
    "forbidden-art": "هنر ممنوعه",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={goBack}
              variant="outline"
              className="bg-white/10 border-purple-300/50 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              بازگشت
            </Button>
            <h1 className="text-3xl font-bold text-white">پروفایل کاربری</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-lg border-purple-300/30">
              <CardHeader className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                  <ArrowLeft className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-white">{currentUser.username}</CardTitle>
                <div className="flex items-center justify-center gap-2 text-purple-200">
                  <Shield className="w-4 h-4" />
                  <span>{currentUser.isAdmin ? "مدیر سایت" : "کاربر عادی"}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-purple-200">
                  <Calendar className="w-4 h-4" />
                  <span>عضو از: {new Date(currentUser.createdAt).toLocaleDateString("fa-IR")}</span>
                </div>
                <div className="text-center">
                  <p className="text-purple-200 text-sm">تعداد پست‌ها</p>
                  <p className="text-2xl font-bold text-white">{userPosts.length}</p>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isEditing ? (
                    <>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      لغو ویرایش
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-2" />
                      ویرایش پروفایل
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Edit Form */}
            {isEditing && (
              <Card className="bg-white/10 backdrop-blur-lg border-purple-300/30 mt-6">
                <CardHeader>
                  <CardTitle className="text-white">ویرایش اطلاعات</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="username" className="text-white">
                      نام کاربری
                    </Label>
                    <Input
                      id="username"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="bg-white/20 border-purple-300/50 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-white">
                      رمز عبور جدید (اختیاری)
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-white/20 border-purple-300/50 text-white"
                      placeholder="برای تغییر رمز عبور پر کنید"
                    />
                  </div>
                  {newPassword && (
                    <div>
                      <Label htmlFor="confirm-password" className="text-white">
                        تکرار رمز عبور
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-white/20 border-purple-300/50 text-white"
                        placeholder="رمز عبور را مجدداً وارد کنید"
                      />
                    </div>
                  )}
                  <Button onClick={handleUpdateProfile} className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    ذخیره تغییرات
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* User Posts */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-lg border-purple-300/30">
              <CardHeader>
                <CardTitle className="text-white">پست‌های شما</CardTitle>
              </CardHeader>
              <CardContent>
                {userPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-white text-lg">هنوز هیچ پستی ندارید</p>
                    <p className="text-purple-200 mt-2">
                      {currentUser.isAdmin ? "اولین پست خود را اضافه کنید" : "منتظر دسترسی مدیر باشید"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userPosts.map((post) => (
                      <Card key={post.id} className="bg-white/5 border-purple-300/20">
                        <CardHeader className="p-0">
                          <img
                            src={post.imageUrl || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-32 object-cover rounded-t-lg"
                          />
                        </CardHeader>
                        <CardContent className="p-3">
                          <h3 className="text-white font-medium text-sm mb-1">{post.title}</h3>
                          <p className="text-purple-200 text-xs mb-2 line-clamp-2">{post.description}</p>
                          <div className="flex justify-between text-xs text-purple-300">
                            <span>{elementNames[post.element] || post.element}</span>
                            <span>{new Date(post.createdAt).toLocaleDateString("fa-IR")}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
