import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WinModalProps {
  open: boolean;
  attempts: number;
  onClose: () => void;
  onSignup?: () => void;
  showSignupCTA?: boolean;
}

const WinModal: React.FC<WinModalProps> = ({ open, attempts, onClose, onSignup, showSignupCTA }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="text-center">
        <DialogHeader>
          <DialogTitle>🎉 Bravo !</DialogTitle>
        </DialogHeader>
        <p className="mt-2">
          Tu as trouvé le mot en {attempts} essai{attempts > 1 ? 's' : ''} !
        </p>

        {showSignupCTA && (
          <div className="mt-4">
            <p className="mb-2">Crée un compte pour suivre ton classement 🔥</p>
            <Button onClick={onSignup}>Créer un compte</Button>
          </div>
        )}

        <Button className="mt-4" variant="secondary" onClick={onClose}>
          Fermer
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default WinModal;
