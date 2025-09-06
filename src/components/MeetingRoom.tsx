import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Users, 
  MessageSquare, 
  FileText, 
  Settings,
  Clock,
  Calendar,
  User,
  Share2,
  Copy,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { Meeting } from '@/types/task';
import { format } from 'date-fns';

interface MeetingRoomProps {
  meeting: Meeting;
  onLeave: () => void;
  onEnd: () => void;
}

interface Participant {
  id: string;
  name: string;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isSpeaking: boolean;
  isHost: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system';
}

const MeetingRoom: React.FC<MeetingRoomProps> = ({ meeting, onLeave, onEnd }) => {
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isCameraOff, setIsCameraOff] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');
  const [meetingBrief, setMeetingBrief] = useState('');
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize meeting with default settings (camera off, mic muted)
  useEffect(() => {
    if (meeting.meetingSettings) {
      setIsCameraOff(meeting.meetingSettings.autoVideoOff);
      setIsMuted(meeting.meetingSettings.autoMute);
    }

    // Add current user as participant
    setParticipants([
      {
        id: 'current-user',
        name: 'You',
        isVideoOn: !meeting.meetingSettings?.autoVideoOff,
        isAudioOn: !meeting.meetingSettings?.autoMute,
        isSpeaking: false,
        isHost: true
      }
    ]);

    // Add meeting attendees
    const meetingParticipants = meeting.attendees.map(attendee => ({
      id: attendee.id || `attendee-${Math.random()}`,
      name: attendee.name,
      isVideoOn: false,
      isAudioOn: false,
      isSpeaking: false,
      isHost: false
    }));
    setParticipants(prev => [...prev, ...meetingParticipants]);

    // Add welcome message
    setChatMessages([
      {
        id: 'welcome',
        sender: 'System',
        message: `Welcome to "${meeting.title}" meeting`,
        timestamp: new Date(),
        type: 'system'
      }
    ]);
  }, [meeting]);

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    setIsCameraOff(!isCameraOff);
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    setIsMuted(!isMuted);
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        sender: 'You',
        message: newMessage.trim(),
        timestamp: new Date(),
        type: 'text'
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const generateMeetingBrief = async () => {
    setIsGeneratingBrief(true);
    try {
      const response = await fetch('http://localhost:5000/api/ai/meeting-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          meetingId: meeting.id,
          notes: meetingNotes
        })
      });

      const data = await response.json();
      if (data.success) {
        setMeetingBrief(data.data.summary.summary);
      }
    } catch (error) {
      console.error('Error generating meeting brief:', error);
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(meeting.meetingLink || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">{meeting.title}</h1>
            <p className="text-slate-400">
              {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={copyMeetingLink}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              {copied ? <CheckCircle className="h-4 w-4 mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
              {copied ? 'Copied!' : 'Share'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSettings(!showSettings)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-96">
              <CardContent className="p-0 h-full">
                <div className="relative h-full bg-slate-900 rounded-lg overflow-hidden">
                  {/* Video Grid */}
                  <div className="grid grid-cols-2 gap-2 h-full p-4">
                    {participants.map((participant, index) => (
                      <motion.div
                        key={participant.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`relative bg-slate-800 rounded-lg flex items-center justify-center ${
                          participant.isSpeaking ? 'ring-2 ring-green-500' : ''
                        }`}
                      >
                        {participant.isVideoOn ? (
                          <video
                            ref={videoRef}
                            className="w-full h-full object-cover rounded-lg"
                            autoPlay
                            muted
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-400">
                            <User className="h-12 w-12 mb-2" />
                            <span className="text-sm">{participant.name}</span>
                            {participant.isHost && (
                              <Badge className="mt-2 bg-purple-600">Host</Badge>
                            )}
                          </div>
                        )}
                        
                        {/* Participant Controls */}
                        <div className="absolute bottom-2 left-2 flex space-x-1">
                          {!participant.isAudioOn && (
                            <div className="bg-red-500 rounded-full p-1">
                              <MicOff className="h-3 w-3 text-white" />
                            </div>
                          )}
                          {!participant.isVideoOn && (
                            <div className="bg-red-500 rounded-full p-1">
                              <VideoOff className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Meeting Status */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    {isRecording && (
                      <Badge className="bg-red-600 animate-pulse">
                        <Square className="h-3 w-3 mr-1" />
                        Recording
                      </Badge>
                    )}
                    {isScreenSharing && (
                      <Badge className="bg-blue-600">
                        <Share2 className="h-3 w-3 mr-1" />
                        Sharing
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meeting Controls */}
            <div className="flex items-center justify-center space-x-4 mt-4">
              <Button
                onClick={toggleAudio}
                className={`${isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-600 hover:bg-slate-700'} text-white`}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              
              <Button
                onClick={toggleVideo}
                className={`${isCameraOff ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-600 hover:bg-slate-700'} text-white`}
              >
                {isCameraOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
              </Button>
              
              <Button
                onClick={toggleScreenShare}
                className={`${isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-600 hover:bg-slate-700'} text-white`}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={toggleRecording}
                className={`${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-600 hover:bg-slate-700'} text-white`}
              >
                {isRecording ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button
                onClick={onLeave}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <PhoneOff className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-slate-700">
                <TabsTrigger value="chat" className="data-[state=active]:bg-purple-600">Chat</TabsTrigger>
                <TabsTrigger value="notes" className="data-[state=active]:bg-purple-600">Notes</TabsTrigger>
                <TabsTrigger value="brief" className="data-[state=active]:bg-purple-600">Brief</TabsTrigger>
              </TabsList>

              {/* Chat Tab */}
              <TabsContent value="chat" className="space-y-4">
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-80">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-sm flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-48 overflow-y-auto p-4 space-y-2">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`${
                            message.type === 'system' 
                              ? 'text-center text-slate-400 text-xs' 
                              : 'text-white'
                          }`}
                        >
                          {message.type === 'text' && (
                            <div className="flex items-start space-x-2">
                              <span className="text-purple-400 text-xs font-medium">
                                {message.sender}:
                              </span>
                              <span className="text-sm">{message.message}</span>
                            </div>
                          )}
                          {message.type === 'system' && (
                            <div className="text-xs text-slate-400 italic">
                              {message.message}
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                    <div className="p-4 border-t border-slate-700">
                      <div className="flex space-x-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <Button
                          onClick={sendMessage}
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Send
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="space-y-4">
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-80">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-sm flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Meeting Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <Textarea
                      value={meetingNotes}
                      onChange={(e) => setMeetingNotes(e.target.value)}
                      placeholder="Take notes during the meeting..."
                      className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 h-48 resize-none"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Brief Tab */}
              <TabsContent value="brief" className="space-y-4">
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-80">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-sm flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Meeting Brief
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <Button
                        onClick={generateMeetingBrief}
                        disabled={isGeneratingBrief || !meetingNotes}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {isGeneratingBrief ? 'Generating...' : 'Generate Brief'}
                      </Button>
                      
                      {meetingBrief && (
                        <div className="bg-slate-700/50 rounded-lg p-3">
                          <p className="text-white text-sm">{meetingBrief}</p>
                        </div>
                      )}
                      
                      {!meetingNotes && (
                        <div className="text-center text-slate-400 text-xs">
                          Add notes to generate a meeting brief
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Participants List */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Participants ({participants.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-white text-sm">{participant.name}</span>
                        {participant.isHost && (
                          <Badge className="bg-purple-600 text-xs">Host</Badge>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        {!participant.isAudioOn && (
                          <MicOff className="h-3 w-3 text-red-400" />
                        )}
                        {!participant.isVideoOn && (
                          <VideoOff className="h-3 w-3 text-red-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingRoom;