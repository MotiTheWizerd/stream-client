"use client";

import { useState } from "react";
import { Save, AlertCircle, Info, ToggleLeft, ToggleRight } from "lucide-react";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const SettingsSection = ({
  title,
  description,
  children,
}: SettingsSectionProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
      <div className="mt-6 space-y-6">{children}</div>
    </div>
  );
};

interface ToggleSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch = ({
  label,
  description,
  checked,
  onChange,
}: ToggleSwitchProps) => {
  return (
    <div className="flex items-start justify-between">
      <div>
        <label className="text-sm font-medium text-gray-900">{label}</label>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      <button
        type="button"
        className={`${
          checked ? "bg-blue-600" : "bg-gray-200"
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
        onClick={() => onChange(!checked)}
      >
        <span className="sr-only">Toggle {label}</span>
        <span
          className={`${
            checked ? "translate-x-5" : "translate-x-1"
          } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
        />
        {checked ? (
          <ToggleRight className="absolute right-0.5 text-white" size={16} />
        ) : (
          <ToggleLeft className="absolute left-0.5 text-gray-400" size={16} />
        )}
      </button>
    </div>
  );
};

interface InputFieldProps {
  label: string;
  description?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

const InputField = ({
  label,
  description,
  type = "text",
  placeholder,
  value,
  onChange,
}: InputFieldProps) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-900">{label}</label>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
      <input
        type={type}
        className="mt-2 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

interface AlertProps {
  type: "info" | "warning";
  message: string;
}

const Alert = ({ type, message }: AlertProps) => {
  return (
    <div
      className={`p-4 rounded-md ${
        type === "info" ? "bg-blue-50" : "bg-yellow-50"
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {type === "info" ? (
            <Info className="h-5 w-5 text-blue-400" />
          ) : (
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          )}
        </div>
        <div className="ml-3">
          <p
            className={`text-sm ${
              type === "info" ? "text-blue-700" : "text-yellow-700"
            }`}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function SettingsPage() {
  // General settings
  const [siteName, setSiteName] = useState("Streaming Platform");
  const [siteDescription, setSiteDescription] = useState(
    "The best platform for content creators"
  );
  const [contactEmail, setContactEmail] = useState("admin@example.com");

  // Features
  const [liveStreamingEnabled, setLiveStreamingEnabled] = useState(true);
  const [subscriptionsEnabled, setSubscriptionsEnabled] = useState(true);
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [messagingEnabled, setMessagingEnabled] = useState(true);

  // Security
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [contentModeration, setContentModeration] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState("3");

  // API
  const [apiKey, setApiKey] = useState("sk_live_xxxxxxxxxxxxxxxxxxxxx");

  // Monetization
  const [payoutsEnabled, setPayoutsEnabled] = useState(true);
  const [minimumPayout, setMinimumPayout] = useState("25");
  const [platformFee, setPlatformFee] = useState("10");

  const handleSaveSettings = () => {
    // Here you would save settings to your backend
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform Settings</h1>
        <p className="text-gray-500 mt-1">
          Configure your website's global settings
        </p>
      </div>

      <Alert
        type="info"
        message="Changes you make here will affect the entire platform. Make sure you understand the impact before saving."
      />

      <div className="space-y-6">
        {/* General Settings */}
        <SettingsSection
          title="General Settings"
          description="Basic information about your platform"
        >
          <InputField
            label="Site Name"
            value={siteName}
            onChange={setSiteName}
          />
          <InputField
            label="Site Description"
            description="Brief description of your platform"
            value={siteDescription}
            onChange={setSiteDescription}
          />
          <InputField
            label="Contact Email"
            type="email"
            value={contactEmail}
            onChange={setContactEmail}
          />
        </SettingsSection>

        {/* Features */}
        <SettingsSection
          title="Features"
          description="Enable or disable platform features"
        >
          <ToggleSwitch
            label="Live Streaming"
            description="Allow users to create live streams"
            checked={liveStreamingEnabled}
            onChange={setLiveStreamingEnabled}
          />
          <ToggleSwitch
            label="Subscriptions"
            description="Allow premium content and subscriptions"
            checked={subscriptionsEnabled}
            onChange={setSubscriptionsEnabled}
          />
          <ToggleSwitch
            label="Comments"
            description="Allow comments on content"
            checked={commentsEnabled}
            onChange={setCommentsEnabled}
          />
          <ToggleSwitch
            label="Direct Messaging"
            description="Allow users to send private messages"
            checked={messagingEnabled}
            onChange={setMessagingEnabled}
          />
        </SettingsSection>

        {/* Security */}
        <SettingsSection
          title="Security Settings"
          description="Configure platform security options"
        >
          <ToggleSwitch
            label="Two-Factor Authentication"
            description="Require 2FA for all admin accounts"
            checked={twoFactorAuth}
            onChange={setTwoFactorAuth}
          />
          <ToggleSwitch
            label="Content Moderation"
            description="Automatically review content for policy violations"
            checked={contentModeration}
            onChange={setContentModeration}
          />
          <InputField
            label="Failed Login Attempts"
            description="Number of failed attempts before account lockout"
            type="number"
            value={loginAttempts}
            onChange={setLoginAttempts}
          />
        </SettingsSection>

        {/* API Settings */}
        <SettingsSection
          title="API Settings"
          description="Manage API access and keys"
        >
          <InputField
            label="API Key"
            description="Keep this secure and don't share it"
            value={apiKey}
            onChange={setApiKey}
          />
          <Alert
            type="warning"
            message="Your API key gives full access to your account. Never share it publicly or commit it to source code repositories."
          />
        </SettingsSection>

        {/* Monetization */}
        <SettingsSection
          title="Monetization"
          description="Configure payment and monetization settings"
        >
          <ToggleSwitch
            label="Enable Payouts"
            description="Allow creators to receive payments"
            checked={payoutsEnabled}
            onChange={setPayoutsEnabled}
          />
          <InputField
            label="Minimum Payout ($)"
            description="Minimum amount required for payout processing"
            type="number"
            value={minimumPayout}
            onChange={setMinimumPayout}
          />
          <InputField
            label="Platform Fee (%)"
            description="Percentage fee taken from creator earnings"
            type="number"
            value={platformFee}
            onChange={setPlatformFee}
          />
        </SettingsSection>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleSaveSettings}
          >
            <Save size={16} className="mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
