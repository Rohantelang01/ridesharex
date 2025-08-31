"use client";
import { Button } from "@/components/ui/button";
import { Edit, Wallet, Building2, CreditCard, TrendingUp, History } from "lucide-react";
import { UserProfile } from "@/types/profile";

interface PaymentsDisplayProps {
  profile: UserProfile;
  onEdit: () => void;
}

const PaymentsDisplay = ({ profile, onEdit }: PaymentsDisplayProps) => {
  const wallet = profile.wallet;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Payments & Wallet
        </h3>
        <Button onClick={onEdit} variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Wallet Information */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">Wallet Balance</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Wallet className="w-5 h-5" />
              <span className="text-sm font-medium">Total Balance</span>
            </div>
            <p className="text-2xl font-bold mt-2">₹{wallet?.totalBalance || 0}</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Added Balance</span>
            </div>
            <p className="text-2xl font-bold mt-2">₹{wallet?.addedBalance || 0}</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Wallet className="w-5 h-5" />
              <span className="text-sm font-medium">Generated Balance</span>
            </div>
            <p className="text-2xl font-bold mt-2">₹{wallet?.generatedBalance || 0}</p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">Payment Methods</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* UPI */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span className="font-medium">UPI</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {profile.personalInfo?.upiId || "No UPI ID configured"}
            </p>
          </div>

          {/* Bank Account */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Building2 className="w-5 h-5 text-green-600" />
              <span className="font-medium">Bank Account</span>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bank: {profile.personalInfo?.bankName || "Not configured"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Account: {profile.personalInfo?.accountNumber ? 
                  `****${profile.personalInfo.accountNumber.slice(-4)}` : 
                  "Not configured"
                }
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                IFSC: {profile.personalInfo?.ifscCode || "Not configured"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ride Statistics */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">Ride Statistics</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <History className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Total Rides</p>
              <p className="font-medium">{profile.rideHistory?.length || 0} rides</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <History className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Cancelled Rides</p>
              <p className="font-medium">{profile.cancelList?.length || 0} rides</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {profile.rideHistory && profile.rideHistory.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">Recent Rides</h4>
          <div className="space-y-2">
            {profile.rideHistory.slice(0, 5).map((rideId, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <History className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Ride #{rideId.toString().slice(-8)}</span>
                </div>
                <span className="text-xs text-gray-500">Completed</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsDisplay;
