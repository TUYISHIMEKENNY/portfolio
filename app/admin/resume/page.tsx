"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Download, FileText, Upload } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"

export default function ResumeUploadPage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    })
  }, [])

  const { toast } = useToast()
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeTitle, setResumeTitle] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch existing resumes
    const fetchResumes = async () => {
      try {
        const response = await fetch("/api/resume")
        if (response.ok) {
          const data = await response.json()
          setResumes(data)
        }
      } catch (error) {
        console.error("Error fetching resumes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResumes()
  }, [])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    // Check file type
    if (file.type !== "application/pdf" && !file.name.endsWith(".docx")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file.",
        variant: "destructive",
      })
      return
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    setResumeFile(file)
    // Set default title from filename
    if (!resumeTitle) {
      setResumeTitle(file.name.split(".")[0])
    }
  }

  const handleUpload = async () => {
    if (!resumeFile) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", resumeFile)
      formData.append("type", "resume")
      formData.append("title", resumeTitle || resumeFile.name)
      formData.append("description", `Uploaded on ${new Date().toLocaleDateString()}`)
      formData.append("isActive", resumes.length === 0 ? "true" : "false")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload resume")
      }

      toast({
        title: "Success",
        description: "Resume uploaded successfully!",
      })

      // Refresh the page to show the new resume
      router.refresh()

      // Reset form
      setResumeFile(null)
      setResumeTitle("")
    } catch (error) {
      console.error("Error uploading resume:", error)
      toast({
        title: "Error",
        description: "Failed to upload resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSetActive = async (id) => {
    try {
      const response = await fetch("/api/resume", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error("Failed to set active resume")
      }

      toast({
        title: "Success",
        description: "Active resume updated successfully!",
      })

      // Update local state
      setResumes(
        resumes.map((resume) => ({
          ...resume,
          isActive: resume.id === id,
        })),
      )
    } catch (error) {
      console.error("Error setting active resume:", error)
      toast({
        title: "Error",
        description: "Failed to update active resume. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/resume/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete resume")
      }

      toast({
        title: "Success",
        description: "Resume deleted successfully!",
      })

      // Update local state
      setResumes(resumes.filter((resume) => resume.id !== id))
    } catch (error) {
      console.error("Error deleting resume:", error)
      toast({
        title: "Error",
        description: "Failed to delete resume. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto max-w-3xl">
        <Link href="/admin" className="mb-8 inline-flex items-center text-sm font-medium" data-aos="fade-up">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8 text-center" data-aos="fade-up">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Upload Resume</h1>
          <p className="mt-2 text-muted-foreground">
            Upload your resume to make it available for download on your portfolio
          </p>
        </div>

        <Card data-aos="fade-up">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div
                className={`rounded-lg border-2 border-dashed p-10 text-center ${
                  dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {resumeFile ? (
                  <div className="flex flex-col items-center">
                    <FileText className="h-16 w-16 text-primary" />
                    <p className="mt-4 text-lg font-medium">{resumeFile.name}</p>
                    <p className="text-sm text-muted-foreground">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <label htmlFor="resume-title" className="text-sm font-medium">
                          Resume Title:
                        </label>
                        <input
                          id="resume-title"
                          type="text"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          value={resumeTitle}
                          onChange={(e) => setResumeTitle(e.target.value)}
                          placeholder="Enter a title for this resume"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => setResumeFile(null)}>
                          Remove
                        </Button>
                        <Button type="button" onClick={handleUpload} disabled={isUploading}>
                          {isUploading ? "Uploading..." : "Upload Resume"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-16 w-16 text-muted-foreground" />
                    <p className="mt-4 text-lg font-medium">Drag and drop your resume file here</p>
                    <p className="text-sm text-muted-foreground">Supports PDF, DOCX (Max 5MB)</p>
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      onClick={() => document.getElementById("resume-upload").click()}
                    >
                      Select File
                    </Button>
                  </>
                )}
              </div>

              {loading ? (
                <div className="flex justify-center p-6">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              ) : (
                <>
                  {resumes.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Current Resumes</h3>
                      {resumes.map((resume) => (
                        <div key={resume.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center gap-3">
                            <FileText
                              className={`h-8 w-8 ${resume.isActive ? "text-primary" : "text-muted-foreground"}`}
                            />
                            <div>
                              <p className="font-medium">{resume.title || resume.fileName}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(resume.updatedAt).toLocaleDateString()} •{" "}
                                {(resume.fileSize / 1024 / 1024).toFixed(2)} MB
                                {resume.isActive && <span className="ml-2 text-primary">(Active)</span>}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={resume.filePath} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4" /> Download
                              </a>
                            </Button>
                            {!resume.isActive && (
                              <Button variant="outline" size="sm" onClick={() => handleSetActive(resume.id)}>
                                Set Active
                              </Button>
                            )}
                            {!resume.isActive && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive"
                                onClick={() => handleDelete(resume.id)}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t pt-6">
                    <h3 className="mb-4 text-lg font-medium">Resume Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Make resume downloadable</p>
                          <p className="text-sm text-muted-foreground">
                            Allow visitors to download your resume from your portfolio
                          </p>
                        </div>
                        <div className="flex h-6 items-center">
                          <input
                            id="resume-downloadable"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            defaultChecked
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Show resume version history</p>
                          <p className="text-sm text-muted-foreground">
                            Display previous versions of your resume in the admin dashboard
                          </p>
                        </div>
                        <div className="flex h-6 items-center">
                          <input
                            id="resume-history"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            defaultChecked
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-4">
                <Link href="/admin" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Back to Dashboard
                  </Button>
                </Link>
                <Button className="flex-1" disabled={!resumeFile || isUploading} onClick={handleUpload}>
                  {isUploading ? "Uploading..." : "Upload Resume"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
