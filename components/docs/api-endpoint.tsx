"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/docs/code-block";
import { AuthBadge, MethodBadge } from "@/components/docs/status-badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ApiEndpointDoc } from "@/lib/api-docs";
import { API_BASE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ApiEndpointProps = {
  endpoint: ApiEndpointDoc;
  id?: string;
};

const languages = [
  { id: "curl", label: "cURL" },
  { id: "node", label: "Node.js" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
] as const;

type Language = (typeof languages)[number]["id"];

function generateCurl(
  method: string,
  url: string,
  auth: string,
  bodyJson?: string,
) {
  const headers: string[] = [];
  if (auth === "jwt") {
    headers.push(`  -H "Authorization: Bearer <access_token>"`);
  } else if (auth === "hmac") {
    headers.push(`  -H "x-signature: <signature>"`);
  }
  if (bodyJson) {
    headers.push(`  -H "Content-Type: application/json"`);
    const escapedBody = bodyJson.replace(/'/g, "'\\''");
    return `curl -X ${method} "${url}" \\\n${headers.join(" \\\n")} \\\n  -d '${escapedBody}'`;
  }
  return `curl -X ${method} "${url}"${headers.length > 0 ? ` \\\n${headers.join(" \\\n")}` : ""}`;
}

function generateNode(
  method: string,
  url: string,
  auth: string,
  bodyJson?: string,
) {
  const headers: string[] = [];
  if (bodyJson) {
    headers.push(`    "Content-Type": "application/json",`);
  }
  if (auth === "jwt") {
    headers.push(`    "Authorization": "Bearer <access_token>",`);
  } else if (auth === "hmac") {
    headers.push(`    "x-signature": "<signature>",`);
  }

  const options: string[] = [];
  options.push(`  method: "${method}",`);
  if (headers.length > 0) {
    const headersStr = headers.map((h) => `    ${h.trim()}`).join("\n");
    options.push(`  headers: {\n${headersStr}\n  },`);
  }
  if (bodyJson) {
    const formattedBody = bodyJson
      .split("\n")
      .map((line, idx) => (idx === 0 ? line : `    ${line}`))
      .join("\n");
    options.push(`  body: JSON.stringify(${formattedBody}),`);
  }

  const optionsStr = options.join("\n");

  return `const url = "${url}";
const options = {
${optionsStr}
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));`;
}

function generatePython(
  method: string,
  url: string,
  auth: string,
  bodyJson?: string,
) {
  const headers = [];
  if (bodyJson) {
    headers.push(`    "Content-Type": "application/json",`);
  }
  if (auth === "jwt") {
    headers.push(`    "Authorization": "Bearer <access_token>",`);
  } else if (auth === "hmac") {
    headers.push(`    "x-signature": "<signature>",`);
  }

  let code = `import requests\n\nurl = "${url}"\n`;

  if (headers.length > 0) {
    const headersStr = headers.join("\n");
    code += `headers = {\n${headersStr}\n}\n`;
  } else {
    code += `headers = {}\n`;
  }

  if (bodyJson) {
    const pythonDictStr = bodyJson
      .replace(/: true/g, ": True")
      .replace(/: false/g, ": False")
      .replace(/: null/g, ": None");
    const formattedBody = pythonDictStr
      .split("\n")
      .map((line, idx) => (idx === 0 ? line : `    ${line}`))
      .join("\n");
    code += `data = ${formattedBody}\n\n`;
    code += `response = requests.${method.toLowerCase()}(url, headers=headers, json=data)\n`;
  } else {
    code += `\nresponse = requests.${method.toLowerCase()}(url, headers=headers)\n`;
  }

  code += `print(response.json())`;
  return code;
}

function generateJava(
  method: string,
  url: string,
  auth: string,
  bodyJson?: string,
) {
  const headers = [];
  if (bodyJson) {
    headers.push(`            .header("Content-Type", "application/json")`);
  }
  if (auth === "jwt") {
    headers.push(
      `            .header("Authorization", "Bearer <access_token>")`,
    );
  } else if (auth === "hmac") {
    headers.push(`            .header("x-signature", "<signature>")`);
  }

  const headersStr = headers.join("\n");

  let methodCall = "";
  if (method === "GET") {
    methodCall = ".GET()";
  } else if (method === "DELETE") {
    methodCall = ".DELETE()";
  } else if (method === "POST" || method === "PATCH") {
    if (bodyJson) {
      const escapedBody = bodyJson.replace(/"/g, '\\"').split("\n").join("\\n");
      const publisher = `HttpRequest.BodyPublishers.ofString("${escapedBody}")`;
      methodCall =
        method === "POST"
          ? `.POST(${publisher})`
          : `.method("PATCH", ${publisher})`;
    } else {
      methodCall =
        method === "POST"
          ? `.POST(HttpRequest.BodyPublishers.noBody())`
          : `.method("PATCH", HttpRequest.BodyPublishers.noBody())`;
    }
  }

  return `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Main {
    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("${url}"))
${headersStr}
            ${methodCall}
            .build();
            
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body());
    }
}`;
}

export function ApiEndpoint({ endpoint, id }: ApiEndpointProps) {
  const fullPath = `${API_BASE_URL}${endpoint.path}`;
  const [activeLang, setActiveLang] = useState<Language>("curl");

  const codeLanguages: Record<Language, string> = {
    curl: "bash",
    node: "javascript",
    python: "python",
    java: "java",
  };

  const getCode = () => {
    switch (activeLang) {
      case "curl":
        return generateCurl(
          endpoint.method,
          fullPath,
          endpoint.auth,
          endpoint.exampleRequest,
        );
      case "node":
        return generateNode(
          endpoint.method,
          fullPath,
          endpoint.auth,
          endpoint.exampleRequest,
        );
      case "python":
        return generatePython(
          endpoint.method,
          fullPath,
          endpoint.auth,
          endpoint.exampleRequest,
        );
      case "java":
        return generateJava(
          endpoint.method,
          fullPath,
          endpoint.auth,
          endpoint.exampleRequest,
        );
    }
  };

  return (
    <Card id={id} className="scroll-mt-24">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <MethodBadge method={endpoint.method} />
          <code className="font-mono text-sm font-medium">{endpoint.path}</code>
          <AuthBadge auth={endpoint.auth} />
        </div>
        <p className="text-sm text-muted-foreground">{endpoint.description}</p>
        {endpoint.swaggerPath && (
          <Link
            href={endpoint.swaggerPath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            View in Swagger
            <ExternalLink className="size-3.5" />
          </Link>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {endpoint.requestSchema && endpoint.requestSchema.length > 0 && (
          <div>
            <h4 className="mb-3 text-sm font-semibold">Request Body</h4>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2 text-left font-medium">Field</th>
                    <th className="px-4 py-2 text-left font-medium">Type</th>
                    <th className="px-4 py-2 text-left font-medium">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {endpoint.requestSchema.map((field) => (
                    <tr key={field.field} className="border-b last:border-0">
                      <td className="px-4 py-2 font-mono text-xs">
                        {field.field}
                        {field.required && (
                          <span className="ml-1 text-destructive">*</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {field.type}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {field.description ?? "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {endpoint.queryParams && endpoint.queryParams.length > 0 && (
          <div>
            <h4 className="mb-3 text-sm font-semibold">Query Parameters</h4>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2 text-left font-medium">Field</th>
                    <th className="px-4 py-2 text-left font-medium">Type</th>
                    <th className="px-4 py-2 text-left font-medium">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {endpoint.queryParams.map((param) => (
                    <tr key={param.field} className="border-b last:border-0">
                      <td className="px-4 py-2 font-mono text-xs">
                        {param.field}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {param.type}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {param.description ?? "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h4 className="text-sm font-semibold">Example Request</h4>
            <div className="flex bg-muted dark:bg-[#252526] border rounded-lg p-0.5 text-xs">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setActiveLang(lang.id)}
                  className={cn(
                    "px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer",
                    activeLang === lang.id
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
          <CodeBlock code={getCode()} language={codeLanguages[activeLang]} />
        </div>

        {endpoint.exampleRequest && (
          <div>
            <CodeBlock
              code={endpoint.exampleRequest}
              language="json"
              title="Body"
            />
          </div>
        )}

        <Separator />

        <div>
          <h4 className="mb-3 text-sm font-semibold">Example Response</h4>
          <CodeBlock code={endpoint.exampleResponse} language={endpoint.responseLanguage ?? "json"} />
        </div>
      </CardContent>
    </Card>
  );
}
