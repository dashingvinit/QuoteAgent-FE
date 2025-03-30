import { useOrg } from '@/context/org-provider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Mail, Edit } from 'lucide-react';

function OrgDetails() {
  const { activeOrg } = useOrg();

  // If no organization is selected or loaded
  if (!activeOrg) {
    return (
      <Card className="w-full max-w-[200px]">
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>No organization selected</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-min">
      <CardHeader>
        <CardTitle>{activeOrg.name}</CardTitle>
        <CardDescription>Organization details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1 text-xs">
          <p className="font-medium text-gray-500">Email</p>
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            {activeOrg.email}
          </p>
        </div>

        {activeOrg.website && (
          <div className="space-y-1 text-xs">
            <p className="font-medium text-gray-500">Website</p>
            <p className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-gray-500" />
              {activeOrg.website}
            </p>
          </div>
        )}

        {/* {activeOrg.about && (
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">About</p>
            <p className="text-sm">{activeOrg.about}</p>
          </div>
        )} */}

        <div className="flex justify-start gap-4">
          {activeOrg.preferred_currency && (
            <div className="space-y-1 text-xs">
              <p className="font-medium text-gray-500">Currency</p>
              <p>{activeOrg.preferred_currency}</p>
            </div>
          )}

          {activeOrg.createdAt && (
            <div className="space-y-1 text-xs">
              <p className="font-medium text-gray-500">Created</p>
              <p>{new Date(activeOrg.createdAt).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </CardContent>
      {/* <CardFooter className="flex justify-start">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Edit className="size-3" />
          Edit Organization
        </Button>
      </CardFooter> */}
    </Card>
  );
}

export default OrgDetails;
