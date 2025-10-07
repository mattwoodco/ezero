"use client";

import { useCallback, useState } from "react";
import type { EmailTemplate, TemplateMetadata } from "@/lib/email-templates";
import type { EmailBlock } from "@/types/email";

export function useTemplates() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Lists all templates
   */
  const listTemplates = useCallback(
    async (includeStarters = false): Promise<TemplateMetadata[]> => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (includeStarters) {
          params.set("starters", "true");
        }

        const response = await fetch(`/api/templates?${params.toString()}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to list templates");
        }

        return data.templates;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Loads a specific template
   */
  const loadTemplate = useCallback(
    async (id: string): Promise<EmailTemplate | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/templates/${id}`);
        const data = await response.json();

        if (!data.success) {
          if (response.status === 404) {
            return null;
          }
          throw new Error(data.error || "Failed to load template");
        }

        return data.template;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Saves a new template
   */
  const saveTemplate = useCallback(
    async (
      name: string,
      blocks: EmailBlock[],
      options?: {
        description?: string;
        category?: string;
      },
    ): Promise<EmailTemplate> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/templates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            blocks,
            ...options,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to save template");
        }

        return data.template;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Updates an existing template
   */
  const updateTemplate = useCallback(
    async (
      id: string,
      name: string,
      blocks: EmailBlock[],
      options?: {
        description?: string;
        category?: string;
      },
    ): Promise<EmailTemplate> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/templates/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            blocks,
            ...options,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to update template");
        }

        return data.template;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Deletes a template
   */
  const deleteTemplate = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to delete template");
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Duplicates a template
   */
  const duplicateTemplate = useCallback(
    async (id: string, newName: string): Promise<EmailTemplate> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/templates/${id}/duplicate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newName }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to duplicate template");
        }

        return data.template;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Lists available React Email templates for import
   */
  const listImportableTemplates = useCallback(async (): Promise<string[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/templates/import");
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to list importable templates");
      }

      return data.templates;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Imports a React Email template
   */
  const importTemplate = useCallback(
    async (
      templateName: string,
      customName?: string,
    ): Promise<EmailTemplate> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/templates/import", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ templateName, customName }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to import template");
        }

        return data.template;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    listTemplates,
    loadTemplate,
    saveTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    listImportableTemplates,
    importTemplate,
  };
}
