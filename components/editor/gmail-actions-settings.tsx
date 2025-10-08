"use client";

import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getActionTypeDescription,
  getActionTypeLabel,
  validateGmailAction,
} from "@/lib/gmail-actions-utils";
import type {
  GmailActionConfig,
  GmailActionsSettings,
  GmailActionType,
} from "@/types/email";

interface GmailActionsSettingsPanelProps {
  settings: GmailActionsSettings;
  onChange: (settings: GmailActionsSettings) => void;
}

export function GmailActionsSettingsPanel({
  settings,
  onChange,
}: GmailActionsSettingsPanelProps) {
  const [expandedAction, setExpandedAction] = useState<string | undefined>();

  const actions = settings.actions || [];

  const addAction = (type: GmailActionType) => {
    const newAction: GmailActionConfig = {
      type,
      name: "",
    };

    onChange({
      actions: [...actions, newAction],
    });

    // Expand the newly added action
    setExpandedAction(`action-${actions.length}`);
  };

  const updateAction = (index: number, updates: Partial<GmailActionConfig>) => {
    const newActions = [...actions];
    newActions[index] = { ...newActions[index], ...updates };
    onChange({ actions: newActions });
  };

  const removeAction = (index: number) => {
    const newActions = actions.filter((_, i) => i !== index);
    onChange({ actions: newActions });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Gmail Actions</h3>
        <p className="text-xs text-muted-foreground">
          Add interactive buttons that appear in Gmail. Requires Gmail
          whitelisting for production use.
        </p>
      </div>

      {actions.length === 0 ? (
        <div className="p-4 border-2 border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground text-center mb-3">
            No actions added yet. Choose an action type below.
          </p>
        </div>
      ) : (
        <Accordion
          type="single"
          collapsible
          value={expandedAction}
          onValueChange={setExpandedAction}
        >
          {actions.map((action, index) => {
            const validation = validateGmailAction(action);

            return (
              <AccordionItem
                key={`${action.type}-${index}`}
                value={`action-${index}`}
              >
                <AccordionTrigger>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm">
                      {action.name || getActionTypeLabel(action.type)}
                    </span>
                    {!validation.valid && (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <ActionFields
                      action={action}
                      actionIndex={index}
                      onChange={(updates) => updateAction(index, updates)}
                    />

                    {/* Validation Errors */}
                    {validation.errors.length > 0 && (
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                        <p className="text-xs font-medium text-destructive mb-1">
                          Errors:
                        </p>
                        <ul className="list-disc list-inside text-xs text-destructive/80 space-y-0.5">
                          {validation.errors.map((error) => (
                            <li key={error}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Validation Warnings */}
                    {validation.warnings.length > 0 && (
                      <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                        <p className="text-xs font-medium text-yellow-700 dark:text-yellow-500 mb-1">
                          Warnings:
                        </p>
                        <ul className="list-disc list-inside text-xs text-yellow-700/80 dark:text-yellow-500/80 space-y-0.5">
                          {validation.warnings.map((warning) => (
                            <li key={warning}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeAction(index)}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Action
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}

      {/* Add Action Buttons */}
      <div className="space-y-2">
        <p className="text-xs font-medium">Add Action:</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addAction("ViewAction")}
          >
            <Plus className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addAction("ConfirmAction")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Confirm
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addAction("SaveAction")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addAction("RsvpAction")}
          >
            <Plus className="h-4 w-4 mr-2" />
            RSVP
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addAction("TrackAction")}
            className="col-span-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Track Package
          </Button>
        </div>
      </div>
    </div>
  );
}

function ActionFields({
  action,
  actionIndex,
  onChange,
}: {
  action: GmailActionConfig;
  actionIndex: number;
  onChange: (updates: Partial<GmailActionConfig>) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="p-3 bg-muted/50 rounded-md">
        <p className="text-xs text-muted-foreground">
          {getActionTypeDescription(action.type)}
        </p>
      </div>

      {/* Common Fields */}
      <div>
        <label
          htmlFor={`gmail-action-${actionIndex}-name`}
          className="text-xs font-medium block mb-1.5"
        >
          Action Name *
        </label>
        <Input
          id={`gmail-action-${actionIndex}-name`}
          placeholder="e.g. View Order"
          value={action.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="text-sm"
        />
      </div>

      <div>
        <label
          htmlFor={`gmail-action-${actionIndex}-description`}
          className="text-xs font-medium block mb-1.5"
        >
          Description
        </label>
        <Input
          id={`gmail-action-${actionIndex}-description`}
          placeholder="Optional description"
          value={action.description || ""}
          onChange={(e) => onChange({ description: e.target.value })}
          className="text-sm"
        />
      </div>

      {/* Type-specific fields */}
      {action.type === "ViewAction" && (
        <div>
          <label
            htmlFor={`gmail-action-${actionIndex}-target`}
            className="text-xs font-medium block mb-1.5"
          >
            Target URL *
          </label>
          <Input
            id={`gmail-action-${actionIndex}-target`}
            placeholder="https://example.com/action"
            value={action.target || ""}
            onChange={(e) => onChange({ target: e.target.value })}
            className="text-sm"
          />
        </div>
      )}

      {(action.type === "ConfirmAction" || action.type === "SaveAction") && (
        <>
          <div>
            <label
              htmlFor={`gmail-action-${actionIndex}-handler-url`}
              className="text-xs font-medium block mb-1.5"
            >
              Handler URL * (HTTPS required)
            </label>
            <Input
              id={`gmail-action-${actionIndex}-handler-url`}
              placeholder="https://example.com/api/confirm"
              value={action.handler?.url || ""}
              onChange={(e) =>
                onChange({
                  handler: { ...action.handler, url: e.target.value },
                })
              }
              className="text-sm"
            />
          </div>
          <div>
            <label
              htmlFor={`gmail-action-${actionIndex}-handler-method`}
              className="text-xs font-medium block mb-1.5"
            >
              HTTP Method
            </label>
            <select
              id={`gmail-action-${actionIndex}-handler-method`}
              className="w-full text-sm border rounded-md px-3 py-2 bg-background"
              value={action.handler?.method || "POST"}
              onChange={(e) =>
                onChange({
                  handler: {
                    ...action.handler,
                    url: action.handler?.url || "",
                    method: e.target.value as "POST" | "GET",
                  },
                })
              }
            >
              <option value="POST">POST</option>
              <option value="GET">GET</option>
            </select>
          </div>
        </>
      )}

      {action.type === "RsvpAction" && (
        <>
          <div>
            <label
              htmlFor={`gmail-action-${actionIndex}-event-name`}
              className="text-xs font-medium block mb-1.5"
            >
              Event Name *
            </label>
            <Input
              id={`gmail-action-${actionIndex}-event-name`}
              placeholder="e.g. Product Launch Webinar"
              value={action.event?.name || ""}
              onChange={(e) =>
                onChange({
                  event: {
                    ...(action.event || {
                      name: "",
                      startDate: "",
                      location: { name: "" },
                    }),
                    name: e.target.value,
                  },
                })
              }
              className="text-sm"
            />
          </div>
          <div>
            <label
              htmlFor={`gmail-action-${actionIndex}-event-start`}
              className="text-xs font-medium block mb-1.5"
            >
              Start Date * (ISO 8601)
            </label>
            <Input
              id={`gmail-action-${actionIndex}-event-start`}
              placeholder="2025-11-15T14:00:00-08:00"
              value={action.event?.startDate || ""}
              onChange={(e) =>
                onChange({
                  event: {
                    ...(action.event || {
                      name: "",
                      startDate: "",
                      location: { name: "" },
                    }),
                    startDate: e.target.value,
                  },
                })
              }
              className="text-sm"
            />
          </div>
          <div>
            <label
              htmlFor={`gmail-action-${actionIndex}-event-end`}
              className="text-xs font-medium block mb-1.5"
            >
              End Date (ISO 8601)
            </label>
            <Input
              id={`gmail-action-${actionIndex}-event-end`}
              placeholder="2025-11-15T15:00:00-08:00"
              value={action.event?.endDate || ""}
              onChange={(e) =>
                onChange({
                  event: {
                    ...(action.event || {
                      name: "",
                      startDate: "",
                      location: { name: "" },
                    }),
                    endDate: e.target.value,
                  },
                })
              }
              className="text-sm"
            />
          </div>
          <div>
            <label
              htmlFor={`gmail-action-${actionIndex}-event-location`}
              className="text-xs font-medium block mb-1.5"
            >
              Location Name *
            </label>
            <Input
              id={`gmail-action-${actionIndex}-event-location`}
              placeholder="e.g. Virtual Event or 123 Main St"
              value={action.event?.location?.name || ""}
              onChange={(e) =>
                onChange({
                  event: {
                    ...(action.event || {
                      name: "",
                      startDate: "",
                      location: { name: "" },
                    }),
                    location: {
                      ...(action.event?.location || { name: "" }),
                      name: e.target.value,
                    },
                  },
                })
              }
              className="text-sm"
            />
          </div>
        </>
      )}

      {action.type === "TrackAction" && (
        <>
          <div>
            <label
              htmlFor={`gmail-action-${actionIndex}-tracking-url`}
              className="text-xs font-medium block mb-1.5"
            >
              Tracking URL *
            </label>
            <Input
              id={`gmail-action-${actionIndex}-tracking-url`}
              placeholder="https://fedex.com/track?number=123456"
              value={action.parcel?.trackingUrl || action.target || ""}
              onChange={(e) =>
                onChange({
                  parcel: { ...action.parcel, trackingUrl: e.target.value },
                })
              }
              className="text-sm"
            />
          </div>
          <div>
            <label
              htmlFor={`gmail-action-${actionIndex}-tracking-number`}
              className="text-xs font-medium block mb-1.5"
            >
              Tracking Number
            </label>
            <Input
              id={`gmail-action-${actionIndex}-tracking-number`}
              placeholder="123456789"
              value={action.parcel?.trackingNumber || ""}
              onChange={(e) =>
                onChange({
                  parcel: { ...action.parcel, trackingNumber: e.target.value },
                })
              }
              className="text-sm"
            />
          </div>
          <div>
            <label
              htmlFor={`gmail-action-${actionIndex}-carrier`}
              className="text-xs font-medium block mb-1.5"
            >
              Carrier
            </label>
            <Input
              id={`gmail-action-${actionIndex}-carrier`}
              placeholder="e.g. FedEx, UPS, USPS"
              value={action.parcel?.carrier || ""}
              onChange={(e) =>
                onChange({
                  parcel: { ...action.parcel, carrier: e.target.value },
                })
              }
              className="text-sm"
            />
          </div>
        </>
      )}
    </div>
  );
}
