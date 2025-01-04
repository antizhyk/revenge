import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
  import { useAuth } from "@/hooks/auth"

  interface ExitModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
  }
  

const ExitModal = ({ isOpen, onOpenChange }: ExitModalProps) => {
  const { logout } = useAuth()
  
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="font-mono text-white">Підтвердження виходу</DialogTitle>
            <DialogDescription className="font-mono">
              Ви дійсно хочете вийти з облікового запису?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="font-mono border-gray-700 hover:bg-gray-800"
            >
              Скасувати
            </Button>
            <Button
              variant="destructive"
              onClick={logout}
              className="font-mono"
            >
              Вийти
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
}

export default ExitModal