// Test script to check CV URL accessibility
import fetch from "node-fetch";

const testCvUrl = async () => {
  const urls = [
    "https://res.cloudinary.com/dpasep1rq/image/upload/v1763186468/auth-mern/cv/gnqqki73k9zoqxmjdtgs.pdf",
    "https://res.cloudinary.com/dpasep1rq/raw/upload/v1763186468/auth-mern/cv/gnqqki73k9zoqxmjdtgs.pdf",
    "https://res.cloudinary.com/dpasep1rq/image/upload/v1763186672/auth-mern/cv/eh368bmxjkx57hstepzq.pdf",
    "https://res.cloudinary.com/dpasep1rq/raw/upload/v1763186672/auth-mern/cv/eh368bmxjkx57hstepzq.pdf",
  ];

  for (const url of urls) {
    try {
      console.log(`\nTesting URL: ${url}`);
      const response = await fetch(url, {
        method: "HEAD", // Just check if it exists without downloading
      });

      console.log(`Status: ${response.status}`);
      console.log(`Status Text: ${response.statusText}`);
      console.log(`Content-Type: ${response.headers.get("content-type")}`);
      console.log(`Content-Length: ${response.headers.get("content-length")}`);

      if (response.ok) {
        console.log("✅ URL is accessible");
      } else {
        console.log("❌ URL is not accessible");
      }
    } catch (error) {
      console.log(`❌ Error accessing URL: ${error.message}`);
    }
  }
};

testCvUrl();
